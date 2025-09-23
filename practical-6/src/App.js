import React, { useState } from 'react';
import {
  FaEdit,
  FaTrash,
  FaMicrophone,
  FaCheck
} from 'react-icons/fa';
import './App.css';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const handleAddTask = () => {
    if (input.trim() === '') return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].text = input;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: input, done: false }]);
      setHighlightedIndex(tasks.length);
    }

    setInput('');
  };
  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    setHighlightedIndex(null);
  };

  const handleEdit = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
    setHighlightedIndex(null);
  };

  const handleToggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
    setHighlightedIndex(null);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript !== '' && !tasks.some(task => task.text === transcript)) {
        setTasks((prev) => {
          const updated = [...prev, { text: transcript, done: false }];
          setHighlightedIndex(updated.length - 1);
          return updated;
        });
      }
      setInput('');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="container">
      <h1>📝 Get Things Done!</h1>
      <div className="input-area">
        <input
          type="text"
          value={isListening ? "🎤 Listening..." : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's your task today?"
          className={`input-field ${isListening ? "input-listening" : ""}`}
          disabled={isListening}
        />

        <button onClick={handleAddTask} className="add-button">
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
        <button
          onClick={handleVoiceInput}
          className="mic-button"
          title="Speak"
          disabled={isListening}
        >
          <FaMicrophone />
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`task-item ${task.done ? 'completed' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
          >
            <span>{task.text}</span>
            <span className="icons">
              {!task.done && (
                <FaEdit
                  onClick={() => handleEdit(index)}
                  className="icon"
                  title="Edit"
                />
              )}
              {!task.done && (
                <FaTrash
                  onClick={() => handleDelete(index)}
                  className="icon"
                  title="Delete"
                />
              )}
              <FaCheck
                onClick={() => handleToggleDone(index)}
                className="icon"
                title={task.done ? "Undo" : "Mark as Done"}
                style={{ color: task.done ? 'green' : 'gray' }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
