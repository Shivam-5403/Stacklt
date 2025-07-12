import React, { useState } from 'react';
import { Search, MessageCircle, CheckCircle, Clock, Plus } from 'lucide-react';

const dummyQuestions = [
  { id: 1, title: "How to use React hooks?", answered: true, votes: 23, answers: 3, views: 156, tags: ['react', 'hooks'] },
  { id: 2, title: "What is JWT authentication?", answered: false, votes: 15, answers: 1, views: 89, tags: ['jwt', 'auth'] },
  { id: 3, title: "Styling in React using Tailwind", answered: true, votes: 31, answers: 5, views: 234, tags: ['react', 'tailwind'] },
  { id: 4, title: "How to implement dark mode in React?", answered: false, votes: 8, answers: 0, views: 45, tags: ['react', 'dark-mode'] },
  { id: 5, title: "Best practices for API error handling", answered: true, votes: 42, answers: 7, views: 312, tags: ['api', 'error-handling'] },
];

const HomePage = () => {
  const [filter, setFilter] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAskQuestion = () => {
    // navigate('/ask'); // Uncomment when routing is set up
    alert('Navigate to ask question page');
  };

  const handleFilterClick = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredQuestions = dummyQuestions.filter((question) => {
    if (filter === 'Unanswered') return !question.answered;
    return true;
  }).filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
              <MessageCircle className="me-2 text-primary" size={32} />
              <h1 className="h4 mb-0 fw-bold text-dark">Q&A Forum</h1>
            </div>
            <button
              onClick={handleAskQuestion}
              className="btn btn-primary d-flex align-items-center"
            >
              <Plus className="me-2" size={16} />
              Ask Question
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4">
        <div className="mb-4">
          <h2 className="h3 fw-bold text-dark mb-4">All Questions</h2>
          
          {/* Search Bar */}
          <div className="position-relative mb-4">
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
              <Search className="text-muted" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control ps-5"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {['Newest', 'Unanswered', 'More'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => handleFilterClick(filterOption)}
                className={`btn btn-sm ${
                  filter === filterOption
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="row g-3">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="col-12">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        {question.answered ? (
                          <CheckCircle className="me-2 text-success flex-shrink-0" size={20} />
                        ) : (
                          <Clock className="me-2 text-warning flex-shrink-0" size={20} />
                        )}
                        <h3 className="h5 mb-0 text-dark text-truncate">
                          <a href="#" className="text-decoration-none text-dark hover-text-primary">
                            {question.title}
                          </a>
                        </h3>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-primary bg-opacity-10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="d-flex flex-wrap gap-3 text-muted small">
                        <span>
                          <span className="fw-medium text-dark">{question.votes}</span> votes
                        </span>
                        <span>
                          <span className="fw-medium text-dark">{question.answers}</span> answers
                        </span>
                        <span>
                          <span className="fw-medium text-dark">{question.views}</span> views
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 mt-md-0 ms-md-3">
                      <span className={`badge ${
                        question.answered
                          ? 'bg-success bg-opacity-10 text-success'
                          : 'bg-warning bg-opacity-10 text-warning'
                      }`}>
                        {question.answered ? 'Answered' : 'Unanswered'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredQuestions.length === 0 && (
            <div className="col-12">
              <div className="text-center py-5">
                <MessageCircle className="text-muted mb-3" size={48} />
                <h3 className="h5 text-dark mb-2">No questions found</h3>
                <p className="text-muted">Try adjusting your search or filter criteria.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top mt-5">
        <div className="container-fluid py-3">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
            <p className="text-muted mb-2 mb-sm-0 small">
              You can view questions without logging in.
            </p>
            <p className="text-muted small">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
        }
        .card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        .gap-1 > * {
          margin-right: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .gap-2 > * {
          margin-right: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .gap-3 > * {
          margin-right: 1rem !important;
          margin-bottom: 1rem !important;
        }
      `}</style>
    </div>
  );
};

export default HomePage;