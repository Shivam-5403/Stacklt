import React, { useState, useRef, useEffect } from "react";
import { Search, MessageCircle, CheckCircle, Clock, Plus, ThumbsUp, ThumbsDown, Edit3, Bold, Italic, Code, Link, List, Eye, Underline, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Smile, Award } from "lucide-react";
import { isUserLoggedIn } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [votedAnswers, setVotedAnswers] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const editorRef = useRef(null);
  const navigator = useNavigate();

  // Extract question ID from URL
  const getQuestionIdFromUrl = () => {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1]; // Get the last segment
  };

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '💡', '🔥', '⭐', '✨', '💯', '❤️', '💖', '💕', '💗', '💓'
  ];

  // Fetch question data from API
  const fetchQuestionData = async (questionId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/questions/${questionId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Question not found');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      setQuestionData(data);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching question:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  };

  // Load question data on component mount
  useEffect(() => {
    const questionId = getQuestionIdFromUrl();
    if (questionId) {
      fetchQuestionData(questionId);
    } else {
      setError('Invalid question ID');
      setLoading(false);
    }
  }, []);

  // Vote handling with proper API integration
  const handleVote = async (answerId, direction) => {
    console.log('Vote clicked:', answerId, direction);
    
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      const isConfirmed = window.confirm("You need to be logged in to vote. Click OK to login or Cancel to register.");
      if (isConfirmed) {
        navigator('/login');
      } else {
        navigator('/register');
      }
      return;
    }
    
    try {
      const currentVote = votedAnswers[answerId];
      
      // Calculate vote change
      let voteChange = 0;
      let newVoteState = null;
      
      if (currentVote === direction) {
        // Remove vote (toggle off)
        voteChange = direction === 'up' ? -1 : 1;
        newVoteState = null;
      } else {
        // Add or change vote
        if (currentVote === 'up' && direction === 'down') {
          voteChange = -2; // From +1 to -1
        } else if (currentVote === 'down' && direction === 'up') {
          voteChange = 2; // From -1 to +1
        } else if (direction === 'up') {
          voteChange = 1; // New upvote
        } else {
          voteChange = -1; // New downvote
        }
        newVoteState = direction;
      }
      
      // Store previous state for rollback
      const previousVotedAnswers = { ...votedAnswers };
      const previousQuestionData = { ...questionData };
      
      // Update vote state immediately (optimistic update)
      const newVotedAnswers = { ...votedAnswers };
      if (newVoteState === null) {
        delete newVotedAnswers[answerId];
      } else {
        newVotedAnswers[answerId] = newVoteState;
      }
      setVotedAnswers(newVotedAnswers);
      
      // Update question data optimistically
      setQuestionData(prev => ({
        ...prev,
        answers: prev.answers.map(answer =>
          answer._id === answerId
            ? { ...answer, votes: answer.votes + voteChange }
            : answer
        )
      }));

      // API call to update vote
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ direction: newVoteState }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Vote API response:', result);
      
    } catch (apiError) {
      console.error('API Error:', apiError);
      
      // Rollback optimistic updates
      setVotedAnswers(previousVotedAnswers);
      setQuestionData(previousQuestionData);
      
      // Show user-friendly error message
      alert(`Failed to vote: ${apiError.message}. Please try again.`);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
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
    } else if (editorRef.current) {
      editorRef.current.innerHTML += emoji;
    }
    setShowEmojiPicker(false);
    editorRef.current?.focus();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setNewAnswer(editorRef.current.innerHTML);
    }
  };

  const handleSubmit = async () => {
    const check = isUserLoggedIn();
    
    if (!check) {
      const isConfirmed = window.confirm("Are you StackIt User? If Yes then Click Ok to login in order to submit the answer.");
      if (isConfirmed) {
        console.log("User clicked OK");
        navigator('/login');
      } else {
        console.log("User clicked Cancel");
        navigator('/register');
      }
      return;
    }
    
    if (!newAnswer.trim()) {
      alert('Please enter your answer before submitting.');
      return;
    }
    
    try {
      setSubmittingAnswer(true);
      console.log('Submitting answer for question:', questionData._id);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/answers/${questionData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ content: newAnswer.trim() }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You need to be logged in to submit an answer.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to submit an answer.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const newAnswerData = await response.json();
      
      // Update local state
      setQuestionData(prev => ({
        ...prev,
        answers: [...prev.answers, newAnswerData]
      }));
      
      // Reset form
      setNewAnswer("");
      setIsPreview(false);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      
      console.log('Answer submitted successfully');
      alert('Your answer has been submitted successfully!');
      
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert(`Error submitting answer: ${err.message}`);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const renderContent = (content) => {
    return content;
  };

  const formatPreview = (text) => {
    return text || "Nothing to preview...";
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Loading question...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <div className="text-danger mb-3">
                  <MessageCircle size={48} />
                </div>
                <h5 className="text-danger">Error Loading Question</h5>
                <p className="text-muted">{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const questionId = getQuestionIdFromUrl();
                    if (questionId) {
                      fetchQuestionData(questionId);
                    } else {
                      window.location.reload();
                    }
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!questionData) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <h5>Question not found</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Question Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <MessageCircle className="me-2 text-primary" size={24} />
                <h1 className="h4 mb-0 fw-bold">{questionData.title}</h1>
              </div>
              
              <div className="mb-3">
                <p className="text-muted mb-2">
                  Asked by <strong>{questionData.author?.username || 'Unknown'}</strong> • 
                  {formatDate(questionData.createdAt)}
                </p>
                <div className="d-flex gap-2">
                  {questionData.tags && questionData.tags.map(tag => (
                    <span key={tag._id} className="badge bg-primary bg-opacity-10 text-primary">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="question-content">
                <div dangerouslySetInnerHTML={{ __html: questionData.description }} />
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <CheckCircle className="me-2 text-success" size={20} />
                {questionData.answers ? questionData.answers.length : 0} Answer{questionData.answers && questionData.answers.length !== 1 ? 's' : ''}
              </h5>
            </div>
            <div className="card-body p-0">
              {questionData.answers && questionData.answers.length > 0 ? (
                questionData.answers.map((answer) => (
                  <div key={answer._id} className="border-bottom p-4 last-child-no-border">
                    <div className="d-flex">
                      {/* Vote Section */}
                      <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                        <button
                          className={`btn btn-sm mb-1 ${
                            votedAnswers[answer._id] === 'up' 
                              ? 'btn-success text-white' 
                              : 'btn-outline-success'
                          }`}
                          onClick={() => handleVote(answer._id, 'up')}
                          type="button"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <div className="fw-bold text-dark">{answer.votes || 0}</div>
                        <button
                          className={`btn btn-sm mt-1 ${
                            votedAnswers[answer._id] === 'down' 
                              ? 'btn-danger text-white' 
                              : 'btn-outline-danger'
                          }`}
                          onClick={() => handleVote(answer._id, 'down')}
                          type="button"
                        >
                          <ThumbsDown size={16} />
                        </button>
                        {/* Accepted Answer Badge */}
                        {questionData.acceptedAnswer === answer._id && (
                          <div className="mt-2">
                            <Award className="text-success" size={20} title="Accepted Answer" />
                          </div>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-grow-1">
                        <div 
                          className="mb-3"
                          dangerouslySetInnerHTML={{ __html: renderContent(answer.content) }}
                        />
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <div>
                            answered by <strong className="text-dark">{answer.author?.username || 'Unknown'}</strong> • 
                            {formatDate(answer.createdAt)}
                          </div>
                          <div>
                            {votedAnswers[answer._id] === 'up' && (
                              <span className="text-success">✓ Upvoted</span>
                            )}
                            {votedAnswers[answer._id] === 'down' && (
                              <span className="text-danger">✓ Downvoted</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted">
                  <p>No answers yet. Be the first to answer!</p>
                </div>
              )}
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
                  disabled={!newAnswer.trim() || submittingAnswer}
                >
                  {submittingAnswer ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Answer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx='true'>{`
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
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
};

export default QuestionPage;