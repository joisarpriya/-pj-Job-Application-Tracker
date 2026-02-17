const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'role required' });

  const base = {
    frontend: {
      questions: [
        'Explain the virtual DOM and how React updates the UI.',
        'How does the CSS box model work? What is the difference between margin and padding?',
        'Describe how you would optimize performance in a React application.'
      ],
      tips: ['Practice building small components', 'Learn modern CSS and layouts', 'Prepare portfolio projects with metrics']
    },
    backend: {
      questions: [
        'Explain RESTful APIs and status codes.',
        'How do transactions work in SQL? What is isolation level?',
        'Describe how you would scale a Node.js service.'
      ],
      tips: ['Understand databases and indexing', 'Practice building APIs with authentication', 'Learn Docker basics']
    },
    data: {
      questions: [
        'Explain bias-variance tradeoff in ML.',
        'What is regularization and why is it used?',
        'How do you evaluate a classification model?' 
      ],
      tips: ['Practice ML projects with datasets', 'Learn model evaluation metrics', 'Work on feature engineering']
    }
  };

  const resObj = base[role] || {
    questions: ['Tell me about a challenging project and how you solved it.'],
    tips: ['Practice behavioral answers and STAR format']
  };

  res.json(resObj);
});

module.exports = router;