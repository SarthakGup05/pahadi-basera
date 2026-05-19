FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# NOTE: Since this is a TypeScript project with Prisma, 
# you'll typically want to generate the Prisma client and build the TypeScript code before running.
# Uncomment the following lines once you have initialized `tsconfig.json` and a Prisma schema (`prisma/schema.prisma`):
# RUN npx prisma generate
# RUN npm run build

# Expose the port your server runs on (change if needed)
EXPOSE 3000

# Start the server in development mode (using nodemon)
# For production, change this to: CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
