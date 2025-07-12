import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AskQuestion = () => {
  return (
    <div className="container mt-5">
      

      {/* Ask Question Card */}
      <div className="card">
        <div className="card-header">
          <h3>Ask a Question</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group mb-3">
              <label htmlFor="title">Title</label>
              <input type="text" className="form-control" id="title" placeholder="Summarize your question in one sentence" />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <textarea className="form-control" id="description" rows="6" placeholder="Include all the details people need to answer your question"></textarea>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="tags">Tags</label>
              <input type="text" className="form-control" id="tags" placeholder="Add tags separated by commas (e.g., react, fastapi)" />
            </div>

            <button type="submit" className="btn btn-success">Submit Question</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;