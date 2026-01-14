import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../../lib/axios";
import { useInterviewStore } from "../../store/useInterviewStore";
import { toast } from "sonner";

const BOILERPLATES = {
  python: `# Write your Python 3 code here.\n\ndef solution():\n    print("Hello from Code Runner!")\n\nif __name__ == "__main__":\n    solution()\n`,
  cpp: `// Write your C++ code here.\n#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello from Code Runner!" << endl;\n    return 0;\n}`,
  java: `// Write your Java code here.\n// Main class must be named Main\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Code Runner!");\n    }\n}`,
  javascript: `// Write your JavaScript code here.\n\nfunction solution() {\n    console.log("Hello from Code Runner!");\n}\n\nsolution();`,
};

const normalizeLanguage = (lang) => {
  if (!lang) return "python";
  const lower = lang.toLowerCase();
  if (lower.includes("python")) return "python";
  if (lower.includes("cpp") || lower.includes("c++")) return "cpp";
  if (lower.includes("java") && !lower.includes("script")) return "java";
  if (lower.includes("javascript") || lower.includes("js")) return "javascript";
  return "python";
};

const CodeEditorWindow = () => {
  const { formData, sendMessage } = useInterviewStore();
  const rawLang = formData?.prefferedLanguage || "python";
  const language = normalizeLanguage(rawLang);

  const [code, setCode] = useState(BOILERPLATES[language] || BOILERPLATES.python);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState("vs-dark");

  // Update code if language changes (though usually formData is static during interview)
  useEffect(() => {
    setCode(BOILERPLATES[language] || BOILERPLATES.python);
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setOutput("");
    try {
      // Use proxy or direct URL. Since axiosInstance is configured with baseURL, we use /code/execute
      const response = await axiosInstance.post("/code/execute", {
        language: language,
        code: code,
        input: ""
      });

      const { stdout, stderr, exit_code, error } = response.data;

      if (error) {
        setOutput(`System Error: ${error}`);
      } else if (stderr) {
        setOutput(`Stderr:\n${stderr}\n(Exit Code: ${exit_code})`);
      } else {
        setOutput(stdout);
      }

    } catch (err) {
      console.error("Execution error:", err);
      setOutput("Error: Failed to execute code. " + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionMessage = `<<TYPE:CODING_SUBMISSION>> I have completed the coding task.\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nOutput:\n\`\`\`\n${output}\n\`\`\`\n\nPlease evaluate my code. If you want to ask a conceptual follow-up questions, start your response with <<TYPE:THEORY>>. If you want me to fix the code, start with <<TYPE:CODING>>.`;

      await sendMessage(submissionMessage);
      toast.success("Solution submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit solution.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase">Code Runner ({language})</h2>
        <div className="space-x-2 flex">
          <button
            onClick={handleCompile}
            disabled={isLoading || isSubmitting}
            className={`px-4 py-2 rounded font-semibold transition-colors ${isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
              }`}
          >
            {isLoading ? "Running..." : "Run Code"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting}
            className={`px-4 py-2 rounded font-semibold transition-colors ${isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        {/* Editor Section */}
        <div className="flex-1 border border-gray-700 rounded overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>

        {/* Output Section */}
        <div className="w-full md:w-1/3 bg-black rounded p-4 border border-gray-700 font-mono text-sm overflow-auto">
          <h3 className="text-gray-400 mb-2 border-b border-gray-800 pb-1">Output</h3>
          <pre className="whitespace-pre-wrap text-green-400">
            {output || "Run code to see output..."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWindow;
