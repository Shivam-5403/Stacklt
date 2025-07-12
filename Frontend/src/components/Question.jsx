import React, { useState } from "react";
import { Search, MessageCircle, CheckCircle, Clock, Plus, ThumbsUp, ThumbsDown, Edit3, Bold, Italic, Code, Link, List, Eye } from "lucide-react";

const QuestionPage = () => {
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: `You can use ||, + operator, or CONCAT() function. Example: 
        <pre><code>SELECT first_name || ' ' || last_name AS full_name FROM users;</code></pre>`,
      votes: 5,
      author: "John Doe",
      createdAt: "2 hours ago"
    },
    {
      id: 2,
      content: "Details about how SQL handles nulls and concatenation in edge cases. When using the || operator, if any operand is NULL, the result will be NULL.",
      votes: 2,
      author: "Jane Smith",
      createdAt: "1 hour ago"
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");
  const [votedAnswers, setVotedAnswers] = useState({});
  const [isPreview, setIsPreview] = useState(false);

  const handleVote = (id, direction) => {
  const currentVote = votedAnswers[id];
  
  // If clicking the same vote, remove it (toggle off)
  if (currentVote === direction) {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === id 
          ? { ...ans, votes: direction === 'up' ? ans.votes - 1 : ans.votes + 1 } 
          : ans
      )
    );
    setVotedAnswers(prev => ({ ...prev, [id]: null }));
    return;
  }
  
  // Calculate vote change
  let voteChange = 0;
  if (currentVote === 'up' && direction === 'down') {
    voteChange = -2; // Remove upvote and add downvote
  } else if (currentVote === 'down' && direction === 'up') {
    voteChange = 2; // Remove downvote and add upvote
  } else if (direction === 'up') {
    voteChange = 1; // First time upvote
  } else {
    voteChange = -1; // First time downvote
  }
  
  setAnswers((prev) =>
    prev.map((ans) =>
      ans.id === id 
        ? { ...ans, votes: ans.votes + voteChange } 
        : ans
    )
  );
  
  setVotedAnswers(prev => ({ ...prev, [id]: direction }));
};

  const handleSubmit = () => {
    if (newAnswer.trim()) {
      const newId = Math.max(...answers.map(a => a.id), 0) + 1;
      setAnswers([
        ...answers,
        { 
          id: newId, 
          content: newAnswer.trim(), 
          votes: 0,
          author: "Current User",
          createdAt: "Just now"
        },
      ]);
      setNewAnswer("");
      setIsPreview(false);
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('answer-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newAnswer.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        formattedText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText || 'code block'}\n\`\`\``
          : `\`${selectedText || 'code'}\``;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}\n`;
        break;
      default:
        return;
    }
    
    const newText = newAnswer.substring(0, start) + formattedText + newAnswer.substring(end);
    setNewAnswer(newText);
    
    // Refocus textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const renderContent = (content) => {
    // Simple markdown-like rendering
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-light px-1 rounded">$1</code>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre class="bg-light p-2 rounded"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary">$1</a>')
      .replace(/\n- (.*)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  };

  const formatPreview = (text) => {
    return renderContent(text || "Nothing to preview...");
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Question Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <MessageCircle className="me-2 text-primary" size={24} />
                <h1 className="h4 mb-0 fw-bold">How to join two columns in SQL?</h1>
              </div>
              
              <div className="mb-3">
                <p className="text-muted mb-2">
                  Asked by <strong>Krishna</strong> • 3 hours ago • 
                  <span className="ms-1">156 views</span>
                </p>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary">sql</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary">database</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary">concatenation</span>
                </div>
              </div>
              
              <div className="question-content">
                <p className="mb-0">
                  I have first names in column1 and last names in column2. I want to
                  combine them into a new column called full_name. What's the best approach 
                  for this in SQL?
                </p>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <CheckCircle className="me-2 text-success" size={20} />
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
              </h5>
            </div>
            <div className="card-body p-0">
              {answers.map(({ id, content, votes, author, createdAt }) => (
                <div key={id} className="border-bottom p-4 last-child-no-border">
                  <div className="d-flex">
                    {/* Vote Section */}
                    <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                      <button
                        className={`btn btn-sm btn-outline-success mb-1 ${
  votedAnswers[id] === 'up' ? 'btn-success text-white' : ''
}`}
                        onClick={() => handleVote(id, 'up')}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <div className="fw-bold text-dark">{votes}</div>
                      <button
                        className={`btn btn-sm btn-outline-danger mt-1 ${
  votedAnswers[id] === 'down' ? 'btn-danger text-white' : ''
}`}
                        onClick={() => handleVote(id, 'down')}
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>

                    {/* Answer Content */}
                    <div className="flex-grow-1">
                      <div 
                        className="mb-3"
                        dangerouslySetInnerHTML={{ __html: renderContent(content) }}
                      />
                      <div className="d-flex justify-content-between align-items-center text-muted small">
                        <div>
                          answered by <strong className="text-dark">{author}</strong> • {createdAt}
                        </div>
                        <div>
                          {votedAnswers[id] === 'up' && (
                            <span className="text-success">✓ Upvoted</span>
                          )}
                          {votedAnswers[id] === 'down' && (
                            <span className="text-danger">✓ Downvoted</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Answer Section */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <Edit3 className="me-2 text-primary" size={20} />
                Submit Your Answer
              </h5>
            </div>
            <div className="card-body">
              {/* Rich Text Toolbar */}
              <div className="mb-3">
                <div className="btn-toolbar" role="toolbar">
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertFormatting('bold')}
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertFormatting('italic')}
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertFormatting('code')}
                      title="Code"
                    >
                      <Code size={14} />
                    </button>
                  </div>
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertFormatting('link')}
                      title="Link"
                    >
                      <Link size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => insertFormatting('list')}
                      title="List"
                    >
                      <List size={14} />
                    </button>
                  </div>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${isPreview ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setIsPreview(!isPreview)}
                      title="Preview"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor/Preview */}
              {isPreview ? (
                <div className="border rounded p-3 mb-3 bg-light" style={{ minHeight: '150px' }}>
                  <div dangerouslySetInnerHTML={{ __html: formatPreview(newAnswer) }} />
                </div>
              ) : (
                <textarea
                  id="answer-textarea"
                  className="form-control mb-3"
                  rows="6"
                  placeholder="Write your answer here... 

Use markdown formatting:
**bold text**
*italic text* 
`code`
[link text](url)
- list item"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
              )}

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {isPreview ? 'Preview mode' : 'Supports markdown formatting'}
                </small>
                <button 
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={!newAnswer.trim()}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .last-child-no-border:last-child {
          border-bottom: none !important;
        }
        .question-content pre {
          background-color: #f8f9fa;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        .question-content code {
          background-color: #f8f9fa;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .btn-toolbar .btn-group {
          margin-right: 0.5rem;
        }
        .btn:disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default QuestionPage;