# Use Node.js 24 LTS
FROM node:24-alpine

# Create a working folder inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# The application listens on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]