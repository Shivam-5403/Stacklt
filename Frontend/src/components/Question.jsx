import React, { useState } from "react";
import { Search, MessageCircle, CheckCircle, Clock, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionPage = () => {
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: `You can use ||, + operator, or CONCAT() function. Example: 
        SELECT first_name || ' ' || last_name AS full_name FROM users;`,
      votes: 5,
    },
    {
      id: 2,
      content: "Details about how SQL handles nulls and concatenation in edge cases.",
      votes: 2,
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");

  const handleVote = (id) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === id ? { ...ans, votes: ans.votes + 1 } : ans
      )
    );
  };

  const handleSubmit = () => {
    if (newAnswer.trim()) {
      const newId = answers.length + 1;
      setAnswers([
        ...answers,
        { id: newId, content: newAnswer.trim(), votes: 0 },
      ]);
      setNewAnswer("");
    }
  };

  return (
    <div className="container mt-4">
      <div className="bg-light p-4 rounded shadow-sm">
        <h4 className="mb-3">📊 How to join two columns in SQL?</h4>
        <p>
          I have first names in column1 and last names in column2. I want to
          combine them into a new column called full_name.
        </p>
        <hr />
        <h5 className="mb-3">Answers</h5>
        {answers.map(({ id, content, votes }) => (
          <div key={id} className="mb-3 p-3 border rounded">
            <p>{content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span>👍 {votes} votes</span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleVote(id)}
              >
                Vote
              </button>
            </div>
          </div>
        ))}
        <hr />
        <h5>Submit Your Answer</h5>
        <textarea
          className="form-control mb-2"
          rows="4"
          placeholder="Your answer here..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        ></textarea>
        <button className="btn btn-success" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;