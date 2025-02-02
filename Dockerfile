# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port the app runs on
EXPOSE 9000

# Start the application
CMD ["npm", "run", "dev"]
