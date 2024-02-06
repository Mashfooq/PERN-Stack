FROM node:20-alpine

WORKDIR /home/app/backend

# Copy only the package.json and package-lock.json first to leverage Docker layer caching
COPY ./package.json /package.json

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Command to run the application
CMD ["npm", "run", "dev-node", "--debug"]
# CMD ["tail", "-f", "/dev/null"]