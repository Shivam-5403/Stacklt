import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link, Smile, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AskQuestion = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const editorRef = useRef(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigator = useNavigate()
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tags');
        const options = response.data.map(tag => ({
          value: tag._id,
          label: tag.name
        }));
        setAvailableTags(options);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);




  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '💡', '🔥', '⭐', '✨', '💯', '❤️', '💖', '💕', '💗', '💓'
  ];

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
    setDescription(editorRef.current.innerHTML);
  };

  
const handleSubmit = async () => {
  try {
    const tagIds = selectedTags.map(tag => tag.value);
    const questionData = {
      title,
      description,
      tags: tagIds
    };

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:5000/api/questions', questionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    });

    console.log('Question submitted:', response.data);
    alert('Question submitted successfully!');
    navigator('/');
  } catch (error) {
    console.error('Error submitting question:', error);
    alert('Failed to submit question. Please try again.');
  }
};

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Ask a Question</h3>
        </div>
        <div className="card-body">
          <div>
            <div className="form-group mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                placeholder="Summarize your question in one sentence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Description</label>
              
              {/* Rich Text Editor Toolbar */}
              <div className="border rounded-top p-2 bg-light">
                <div className="d-flex flex-wrap gap-1">
                  {/* Text Formatting */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('bold')}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('italic')}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('underline')}
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Lists */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('insertUnorderedList')}
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('insertOrderedList')}
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Alignment */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyLeft')}
                    title="Align Left"
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyCenter')}
                    title="Align Center"
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('justifyRight')}
                    title="Align Right"
                  >
                    <AlignRight size={16} />
                  </button>
                  
                  <div className="border-start mx-2"></div>
                  
                  {/* Quote */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => executeCommand('formatBlock', 'blockquote')}
                    title="Quote"
                  >
                    <Quote size={16} />
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
                    <Link size={16} />
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
                      <Smile size={16} />
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
                              style={{ fontSize: '18px' }}
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
              
              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                className="form-control"
                contentEditable="true"
                onInput={handleContentChange}
                style={{ 
                  minHeight: '200px', 
                  borderTopLeftRadius: 0, 
                  borderTopRightRadius: 0,
                  outline: 'none'
                }}
                suppressContentEditableWarning={true}
              />
              
              <div className="form-text">
                Use the toolbar above to format your text, add emojis, and more!
              </div>
            </div>

            <div className="form-group mb-3">
        <label className="form-label">Tags</label>
        <Select
          isMulti
          options={availableTags}
          value={selectedTags}
          onChange={setSelectedTags}
          placeholder="Select tags..."
        />
      </div>

            <button 
              type="button" 
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Submit Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;