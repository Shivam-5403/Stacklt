import React, { useState, useRef } from "react";
import { Search, MessageCircle, CheckCircle, Clock, Plus, ThumbsUp, ThumbsDown, Edit3, Bold, Italic, Code, Link, List, Eye, Underline, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Smile } from "lucide-react";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef(null);

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '💡', '🔥', '⭐', '✨', '💯', '❤️', '💖', '💕', '💗', '💓'
  ];

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

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const insertEmoji = (emoji) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editorRef.current.innerHTML += emoji;
    }
    setShowEmojiPicker(false);
    editorRef.current.focus();
  };

  const handleContentChange = () => {
    setNewAnswer(editorRef.current.innerHTML);
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
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  const renderContent = (content) => {
    return content;
  };

  const formatPreview = (text) => {
    return text || "Nothing to preview...";
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
              {/* Rich Text Editor Toolbar */}
              <div className="border rounded-top p-2 bg-light mb-0">
                <div className="d-flex flex-wrap gap-1">
                  {/* Text Formatting */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('bold')}
                    title="Bold"
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('italic')}
                    title="Italic"
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('underline')}
                    title="Underline"
                  >
                    <Underline size={14} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Lists */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('insertUnorderedList')}
                    title="Bullet List"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('insertOrderedList')}
                    title="Numbered List"
                  >
                    <ListOrdered size={14} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Alignment */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyLeft')}
                    title="Align Left"
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyCenter')}
                    title="Align Center"
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyRight')}
                    title="Align Right"
                  >
                    <AlignRight size={14} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Quote */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('formatBlock', 'blockquote')}
                    title="Quote"
                  >
                    <Quote size={14} />
                  </button>
                  
                  {/* Link */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      const url = prompt('Enter URL:');
                      if (url) executeCommand('createLink', url);
                    }}
                    title="Insert Link"
                  >
                    <Link size={14} />
                  </button>
                  
                  {/* Code */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('formatBlock', 'pre')}
                    title="Code Block"
                  >
                    <Code size={14} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Emoji Picker */}
                  <div className="position-relative">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      title="Insert Emoji"
                    >
                      <Smile size={14} />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="position-absolute top-100 start-0 bg-white border rounded shadow-lg p-3 mt-1" style={{ zIndex: 1000, width: '300px' }}>
                        <div className="d-flex flex-wrap gap-1">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              className="btn btn-sm btn-outline-light border-0 p-1"
                              onClick={() => insertEmoji(emoji)}
                              style={{ fontSize: '16px' }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setShowEmojiPicker(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Preview Toggle */}
                  <button
                    type="button"
                    className={`btn btn-sm ${isPreview ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setIsPreview(!isPreview)}
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Text Style */}
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    onChange={(e) => executeCommand('formatBlock', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Format</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="p">Paragraph</option>
                    <option value="pre">Code Block</option>
                  </select>
                  
                  {/* Font Size */}
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    onChange={(e) => executeCommand('fontSize', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Extra Large</option>
                  </select>
                  
                  {/* Text Color */}
                  <input
                    type="color"
                    className="form-control form-control-sm"
                    style={{ width: '40px', height: '32px' }}
                    onChange={(e) => executeCommand('foreColor', e.target.value)}
                    title="Text Color"
                  />
                </div>
              </div>

              {/* Editor/Preview */}
              {isPreview ? (
                <div className="border border-top-0 rounded-bottom p-3 mb-3 bg-light" style={{ minHeight: '200px' }}>
                  <div dangerouslySetInnerHTML={{ __html: formatPreview(newAnswer) }} />
                </div>
              ) : (
                <div
                  ref={editorRef}
                  className="form-control"
                  contentEditable="true"
                  onInput={handleContentChange}
                  style={{ 
                    minHeight: '200px', 
                    borderTopLeftRadius: 0, 
                    borderTopRightRadius: 0,
                    outline: 'none',
                    marginBottom: '1rem'
                  }}
                  suppressContentEditableWarning={true}
                  data-placeholder="Write your answer here... Use the toolbar above to format your text and add emojis!"
                />
              )}

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {isPreview ? 'Preview mode - Click the eye icon to continue editing' : 'Use the rich text editor above to format your answer'}
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
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6c757d;
          font-style: italic;
        }
        [contenteditable]:focus:before {
          content: "";
        }
        [contenteditable] blockquote {
          border-left: 4px solid #007bff;
          padding-left: 1rem;
          margin-left: 0;
          color: #6c757d;
        }
        [contenteditable] pre {
          background-color: #f8f9fa;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          overflow-x: auto;
        }
        [contenteditable] code {
          background-color: #f8f9fa;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default QuestionPage;