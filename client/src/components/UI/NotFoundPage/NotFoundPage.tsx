import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classes from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.errorCode}>404</div>
        <h1 className={classes.title}>Page Not Found</h1>
        <p className={classes.description}>
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className={classes.actions}>
          <Link to="/" className={classes.homeButton}>
            <Button 
              style={{ 
                backgroundColor: '#206a5d', 
                borderColor: '#206a5d',
                color: 'white'
              }}
              size="lg"
            >
              <i className="fas fa-home me-2"></i>
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline-secondary" 
            size="lg" 
            className={classes.backButton}
            onClick={() => window.history.back()}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Go Back
          </Button>
        </div>
        <div className={classes.helpText}>
          <p>Need help? <Link to="/about" className={classes.link}>Contact us</Link> or browse our <Link to="/" className={classes.link}>homepage</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 