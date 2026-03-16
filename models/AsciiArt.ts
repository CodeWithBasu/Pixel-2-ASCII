import mongoose, { Schema, model, models } from 'mongoose';

const AsciiArtSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled ASCII'
  },
  asciiText: {
    type: String, // Stringified ASCII data or color data structure
    required: true
  },
  isColor: {
    type: Boolean,
    default: false
  },
  settings: {
    width: Number,
    charSet: String,
    contrast: Number,
    brightness: Number,
    invert: Boolean,
    grayscale: Boolean,
    edgeDetect: Boolean
  },
  author: {
     type: String,
     default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use existing model if already compiled, otherwise define a new one
const AsciiArt = models.AsciiArt || model('AsciiArt', AsciiArtSchema);

export default AsciiArt;
