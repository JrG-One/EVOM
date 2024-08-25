import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircumIcon from "@klarr-agency/circum-icons-react";
import { RiRobot3Fill } from "react-icons/ri";
import { PiCheckSquareOffsetFill, PiStudentFill } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import Lottie from "react-lottie";
import loadingAnimation from "../../loadingAnimation.json";
import feedbackAnimation from "../../feedbackAnimation.json";
import "./PromptSection.css";
import jsPDF from "jspdf";

const InterviewPage = ({
  name,
  targetCompany,
  role,
  experience,
  preferredLanguage,
  isCoding,
}) => {
  const navigate = useNavigate();
  const [finalPDFData, setFinalPDFData] = useState([]);
  // const[forPDFFeedback, setforFeedback] = useState('');
  const feedbackSectionRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(60 * 60); // Assuming 60 minutes for the interview
  const [introIndex, setIntroIndex] = useState(0); // Index to control the typewriter effect
  const [showintro, setshowintro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const introduction = `Hello, ${name}. I'm your Personal Interviewer at InterviewWhiz. Nice to meet you. 
                        So, as I've seen, you have applied for ${role} position at ${targetCompany}.
                        let's begin your interview. Good luck!`;
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (introIndex < introduction.length) {
        setIntroIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setshowintro(false);
          setIsLoading(false);
          generateRandomQuestions(
            targetCompany,
            experience,
            role,
            isCoding,
            preferredLanguage
          )
            .then((generatedQuestion) => {
              setQuestion(generatedQuestion);
              console.log("line 46 ");
              console.log(finalPDFData);
            })
            .catch((error) => {
              console.error("Error generating question:", error);
              setQuestion("Error generating question. Please try again.");
            });
        }, 1500);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [introIndex, introduction, experience, role, targetCompany]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000); // Change interval to 1 second
  
    return () => {
      clearInterval(timer);
      if (timeLeft === 0) {
        handleEndButton();
      }
    };
  }, [timeLeft]);

  const generateRandomQuestions = async (
    targetCompany,
    yearsOfExperience,
    jobRole,
    isCoding,
    preferredLanguage
  ) => {
    try {
      const systemContext =
        "Please assume the role of an experienced Interviewer with over 20 years of experience in taking interviews for Software Engineer positions in India. The interviewer has a friendly and encouraging style.";

      let prompt = "";
      if (isCoding) {
        prompt = `We are interviewing a candidate for a ${jobRole} position at ${targetCompany} with ${yearsOfExperience} years of experience in ${preferredLanguage} programming. 
        As the interviewer, what would be a good ${preferredLanguage} programming question of medium level to ask them to assess their coding skills and problem-solving abilities in the context of data structures and algorithms. Ensure that the questions prioritize topics such as trees, graphs, dynamic programming, and linked lists.? 
        **[Important] Provide response starting from question, test cases, and constraints in ${preferredLanguage} for a coding problem to assess understanding of problem solving. No explanations or interview dialogue.**`;
      } else {
        // Construct prompt based on user inputs
        prompt = `We are interviewing a candidate for a ${jobRole} position with ${yearsOfExperience} years of experience. 
        As the interviewer, what would be a good theoritical question to ask them to assess their knowledge? 
        ** [Important] Provide ONLY the question to assess understanding of candidate. No explanations or interview dialogue.**`;
      }
      const apiUrl =
        "https://openaitestdeepak.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-02-15-preview";

      const requestBody = {
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stop: null,
      };

      const headers = {
        "Content-Type": "application/json",
        "api-key": "a7781fcdd8614917a206a8e319dc39e0",
      };
      const response = await axios.post(apiUrl, requestBody, { headers });
      const responseData = response.data;

      const generatedQuestion = responseData.choices[0].message.content;
      const forPDFQuestion = generatedQuestion
        .toString()
        .split("\n")
        .map((line, index) =>
          String(line) // Explicitly convert line to a string
        );
      const formattedquestion = generatedQuestion
        .toString()
        .split("\n")
        .map((line, index) => <p key={index}>{line}</p>);
      setFinalPDFData((prevData) => [...prevData, " ", " ", ...forPDFQuestion]); 

      return formattedquestion;
    } catch (error) {
      console.error("Error generating questions:", error);
      return "Error generating questions. Please try again.";
    }
  };

  const handleSubmit = async () => {
    const ele = document.getElementById("sub");
    ele.style.background = "linear-gradient(to right, #91dbf0, #383232)";
    if (feedbackSectionRef.current) {
      feedbackSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    try {
      setIsLoading(true); 
      const feedback = await generateFeedback(question, answer);
      setFeedback(feedback);
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("Error generating feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextButton = async () => {
    setQuestion("");
    generateRandomQuestions(
      targetCompany,
      experience,
      role,
      preferredLanguage,isCoding
    ).then((generatedQuestion) => {
      setQuestion(generatedQuestion);
    });
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    const maxWidth = 180; // Maximum width for each line

    // Initialize variables for positioning text
    let xPos = 10;
    let yPos = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('Times New Roman');
    doc.setFontSize(20);
    doc.text("Detailed Analyzed Feedback Report", 60, yPos);
    doc.setFontSize(14);
    // Loop through each line of content
    finalPDFData.forEach((line) => {
        const words = doc.splitTextToSize(line, maxWidth); // Split line into array of words that fit within maxWidth
        const lines = doc.splitTextToSize(words.join(" "), maxWidth); // Join words into a single string and split into lines

        // Check if adding these lines exceeds the remaining space on the current page
        const spaceLeft = pageHeight - yPos;
        const requiredSpace = lines.length * lineHeight;
        if (requiredSpace > spaceLeft) {
            // Add new page if there's not enough space for these lines
            doc.addPage();
            yPos = 10; // Reset yPos for new page
        }

        // Loop through each line and add to PDF
        lines.forEach((textLine) => {
            doc.text(textLine, xPos, yPos); // Write the text to the PDF
            yPos += lineHeight; // Increment yPos by line height for next line
        });
    });

    // Get current year and month
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

    // Construct filename with the format "Interview-YYYY-MM.pdf"
    const filename = `Interview-${year}-${month}.pdf`;

    // Save the PDF with the constructed filename
    doc.save(filename);
};

  
  const handleEndButton = async () => {
    generatePDF();
    navigate("/");
  };

  const generateFeedback = async (question, solution) => {
    try {
      const systemContext =
        "Please assume the role of an experienced Interviewer with over 20 years of experience in taking interviews for Software Engineer positions in India. The interviewer has a friendly and encouraging style.";
      let prompt = "";

      const areasOfAnalysis = ["Correctness", "edge cases", "efficiency"]; // You can modify this list

      prompt = `We are analyzing a candidate's solution to assess understanding of problem solving. The question is ${question}.
      **Provided Code:**
      ${solution}
      **Analyze the provided code based on the following areas:**
      * ${areasOfAnalysis.join("\n  * ")}
      * **Correctness:** Does the code produce the expected output for the provided test cases? If not, identify discrepancies and suggest potential fixes.
      * **Edge Cases:** Are there any scenarios the code might not handle correctly? Suggest potential edge cases and how the code could be improved to address them.
      * **Efficiency:** Can the code be optimized for better performance (time or space complexity)? If so, suggest potential improvements.
        
      **Note:** 
    - Focus on the core logic of the problem and solution approach.
      **Directly provide feedback without any additioal message apart from feedback, directly addressing the candidate. Please be crisp and provide in consize way**
      `;
      const apiUrl =
        "https://openaitestdeepak.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-02-15-preview";

      const requestBody = {
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stop: null,
      };

      const headers = {
        "Content-Type": "application/json",
        "api-key": "a7781fcdd8614917a206a8e319dc39e0",
      };
      const response = await axios.post(apiUrl, requestBody, { headers });
      const responseData = response.data;
      const formattedAnswer = solution.split("\n").map((line) => String(line)); // Split answer by newline and convert each line to a string
      setFinalPDFData((prevData) => [
        ...prevData,
        " ",
        "Answer: ",
        " ",
        ...formattedAnswer,
      ]); // Append "Answer:" before formatted answer
      const analyzeResponse = responseData.choices[0].message.content;
      const forPDFFeedback = analyzeResponse
        .toString()
        .split("\n")
        .map((line, index) =>
          String(line) // Explicitly convert line to a string
        );
      // const check = analyzeResponse
      // .toString()
      // .split("\n")
      // .map((line, index) =>
      //   String(line) // Explicitly convert line to a string
      // );
      // setforFeedback(check);
      setFinalPDFData((prevData) => [...prevData, " ", "Feedback : ", " ", ...forPDFFeedback]);
      const formattedfeedback = analyzeResponse
        .toString()
        .split("\n")
        .map((line, index) => <p key={index}>{line}</p>);
      return formattedfeedback;
    } catch (error) {
      console.error("Error generating feedback:", error);
      return "Error generating feedback. Please try again.";
    }
  };

  return (
    <div className="interview-page">
      <div className="sections">
        <div className="interviewer-section">
          <h2>
            <RiRobot3Fill
              style={{ fontSize: "60px", verticalAlign: "middle" }}
            />{" "}
            Interviewer
          </h2>
          <hr />
          {!question && !showintro && (
            <div className="loading">
              <Lottie
                options={{
                  animationData: loadingAnimation,
                }}
                height={800}
                width={500}
              />
            </div>
          )}
          {showintro && (
            <div className="intro">
              <p>{introduction.slice(0, introIndex)}</p>
            </div>
          )}
          {!showintro && question && (
            <div className="ques">
              <p>{question}</p>
            </div>
          )}
        </div>
        <div className="student-section">
          <div className="studtop">
            <div className="name">
              <h2>
                <PiStudentFill
                  style={{ fontSize: "60px", verticalAlign: "middle" }}
                />{" "}
                {name}
              </h2>
            </div>
            <div className="timer">
              <p className="time">
                <CircumIcon name="timer" size="2rem" /> Time Left:{" "}
                {formatTime(timeLeft)}
              </p>
              <button id="next" className="next" onClick={handleNextButton}>
                Next Question
              </button>
              <button id="end" className="end" onClick={handleEndButton}>
                End Interview
              </button>
            </div>
          </div>
          <div>
            <hr />
          </div>
          <div className="editor">
            <textarea
              value={answer}
              style={{ width: "98%", height: "max-height" }}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
          <button
            id="sub"
            onClick={handleSubmit}
            style={{ marginTop: "125px" }}
          >
            Submit for AI feedback
          </button>
        </div>
      </div>
      <div className="feedback" ref={feedbackSectionRef}>
        <h2>
          <VscFeedback style={{ fontSize: "60px", verticalAlign: "middle" }} />{" "}
          AI Feedback
        </h2>
        <hr />
        {isLoading && (
          <div className="loading">
            <Lottie
              options={{
                animationData: feedbackAnimation,
              }}
              height={200}
              width={200}
            />
          </div>
        )}
        {!isLoading && feedback && <p>{feedback}</p>}
      </div>
    </div>
  );
};

export default InterviewPage;
