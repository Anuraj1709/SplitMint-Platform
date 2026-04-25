# SplitMint — Your Gateway to Karbon

A full-stack expense splitting application built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- **User Authentication**: Register and login with email
- **Groups**: Create groups with up to 4 participants (including owner)
- **Participants**: Add and manage participants in groups
- **Expenses**: Add expenses with different split modes (equal, custom amounts, percentages)
- **Balance Engine**: Automatic balance calculations and settlement suggestions
- **Visualizations**: Summary cards, balance tables, transaction history

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for production)
   - `JWT_SECRET`: A strong random string for JWT signing
3. Deploy

### Environment Variables

See `.env.example` for required environment variables.

## Project Structure

- `app/` - Next.js app router pages and API routes
- `lib/` - Utility functions and database connection
- `models/` - Mongoose models for User, Group, Participant, Expense
- `components/` - Reusable React components (to be implemented)

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/[id]` - Get group details with expenses
- `POST /api/groups/[id]/participants` - Add participant to group
- `POST /api/groups/[id]/expenses` - Add expense to group

## Database Models

- **User**: email, password, name
- **Group**: name, owner, participants
- **Participant**: name, email, color, user (optional)
- **Expense**: description, amount, date, payer, group, splitType, splits

## Technologies Used

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Styling**: Tailwind CSS

## Future Enhancements

- AI-powered expense categorization and settlement suggestions
- Advanced visualizations and charts
- Mobile app
- Multi-currency support
- Group invitations and sharing
