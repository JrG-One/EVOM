import docker
import os
import tarfile
import io

def create_tar_with_code(filename: str, code: str):
    pw_tar = io.BytesIO()
    tar = tarfile.open(fileobj=pw_tar, mode='w')
    
    code_data = code.encode('utf-8')
    tarinfo = tarfile.TarInfo(name=filename)
    tarinfo.size = len(code_data)
    tar.addfile(tarinfo, io.BytesIO(code_data))
    tar.close()
    pw_tar.seek(0)
    return pw_tar

def run_code_in_docker(language: str, code: str, input_data: str):
    try:
        client = docker.from_env()
    except docker.errors.DockerException:
        return {
            "stdout": "",
            "stderr": "Docker daemon is not running. Please start Docker.",
            "exit_code": -1
        }

    try:
        # 1. Select image based on language (MVP: valid only for python)
        image = "code-runner-sandbox" 
        
        # 2. Command to run
        # 2. Command to run
        if language == "python":
            filename = "main.py"
            # cmd = "python3 main.py"
            cmd = ["python3", "main.py"]
        elif language == "cpp":
            filename = "main.cpp"
            # cmd = "sh -c 'g++ -o main main.cpp && ./main'"
            cmd = ["sh", "-c", "g++ -o main main.cpp && ./main"]
        elif language == "java":
            filename = "Main.java" # Expect class Main
            # cmd = "sh -c 'javac Main.java && java Main'"
            cmd = ["sh", "-c", "javac Main.java && java Main"]
        elif language == "javascript":
            filename = "main.js"
            # cmd = "node main.js"
            cmd = ["node", "main.js"]
        else:
             return {"stdout": "", "stderr": f"Unsupported language: {language}", "exit_code": 1}

        # 3. Create container
        container = client.containers.create(
            image,
            command=cmd,
            network_disabled=True,
            mem_limit="128m",
            # cpu_quota=50000, 
            user="codeuser",
            working_dir="/home/codeuser"
        )
        
        # 4. Copy code into container
        tar_stream = create_tar_with_code(filename, code)
        container.put_archive("/home/codeuser", tar_stream)
        
        # 5. Start and wait
        container.start()
        result = container.wait(timeout=10) # 10s timeout
        
        # 6. Capture logs
        stdout = container.logs(stdout=True, stderr=False).decode('utf-8')
        stderr = container.logs(stdout=False, stderr=True).decode('utf-8')
        exit_code = result['StatusCode']
        
        container.remove()
        
        return {
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": exit_code
        }

    except Exception as e:
        # Clean up if possible
        try:
             container.remove(force=True)
        except:
             pass
        return {
            "stdout": "",
            "stderr": str(e),
            "exit_code": -1
        }
