import React from 'react';

const FooterComponent = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto footer">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Main Copyright Text */}
          <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0">
              <span className="d-block d-sm-inline">© 2025-26 Stacklt.</span>
              <span className="d-block d-sm-inline ms-sm-1">All rights reserved.</span>
            </p>
          </div>
          
          {/* Additional Links/Info */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end flex-wrap gap-3">
              <a href="#privacy" className="text-light text-decoration-none small hover-text-primary">
                Privacy Policy
              </a>
              <a href="#terms" className="text-light text-decoration-none small hover-text-primary">
                Terms of Service
              </a>
              <a href="#contact" className="text-light text-decoration-none small hover-text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="my-3 border-secondary opacity-25" />
        
        {/* Bottom Row */}
        <div className="row">
          <div className="col-12 text-center">
            <small className="">
              Made with ❤️ for the community | 
              <span className="ms-1">Version 1.0</span>
            </small>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
          transition: color 0.2s ease;
        }
        .gap-3 > * {
          margin-right: 1rem !important;
        }
        .gap-3 > *:last-child {
          margin-right: 0 !important;
        }
        @media (max-width: 576px) {
          .gap-3 > * {
            margin-right: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default FooterComponent;