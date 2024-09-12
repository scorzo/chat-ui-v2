# Use the official Node.js image to build the React app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Test internet connectivity
RUN curl https://registry.npmjs.org/ || ping -c 4 8.8.8.8

# Update npm to the latest version
RUN npm install -g npm@latest

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY chat-app/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps


# Copy the rest of the application code
COPY chat-app/ ./

# Build the React app
RUN npm run build

# Use the official Nginx image to serve the React build
FROM nginx:alpine

# Copy the build artifacts from the build stage to the Nginx image
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
