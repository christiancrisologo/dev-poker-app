# Copilot Instructions for Poker App MVP

## Project Overview
Poker App MVP is a web application for running simple online poker games. The MVP focuses on core poker gameplay, allowing users to join tables, play hands, and track basic game stats. The app is built with Next.js and Tailwind CSS for a responsive, modern UI.

## Architecture Principles
- **Component-based design**: UI components should be modular and reusable
- **Game logic separation**: Poker rules and state management must be isolated from UI components
- **Real-time updates**: Use websockets or polling for live game state
- **Responsive design**: Application should work across desktop and mobile devices

## Development Guidelines

### Code Organization
- Place reusable poker utilities in `/utils/poker/` or similar
- Keep game logic (deck, hand evaluation, betting) separate from UI components
- Use TypeScript for type safety with game state and player actions
- Organize by feature (table, hand, player, lobby) rather than file type

### Poker Game Patterns
- **Table management**: Support multiple tables and player seating
- **Hand flow**: Implement core poker hand phases (deal, bet, reveal, winner)
- **Betting logic**: Validate bets, handle pot calculation, and player actions (fold, call, raise)
- **Player state**: Track chips, current bet, and status (active, folded, all-in)

### Data Management
- **Local storage**: Use for session persistence and user settings
- **State management**: Centralize game state (table, players, hands, pot)
- **Basic analytics**: Track hands played, wins, losses, and chip movement

### Testing Approach
- Unit test poker logic (deck shuffle, hand evaluation, betting)
- Test edge cases (all-in, split pots, ties)
- Include accessibility testing for screen readers and keyboard navigation
- Performance test with multiple concurrent tables

### UI/UX Considerations
- **Immediate feedback**: Show real-time updates for player actions and game state
- **Status indicators**: Display player status, current turn, and pot size
- **Error prevention**: Validate user actions and provide clear error messages
- **Mobile-first**: Design touch-friendly interfaces for betting and card selection

## Integration Points
- **Real-time backend**: Integrate with websocket server for live game updates
- **Authentication**: Plan for user accounts and session management
- **Accessibility**: Ensure WCAG compliance for game controls and chat

## Common Patterns
- Use consistent number formatting for chips and bets
- Implement debounced input validation for betting amounts
- Create reusable components for cards, player avatars, and table controls
- Maintain consistent feedback and game flow mechanisms

### Git instructions
- Create a branch for feature `<feature-number>/<feature-name>`
- Implement in phases with regular commits
- Test on multiple devices before merge
- Before committing, run the lint and fix any lint errors
- Create a new commit to fix linting errors
- Fetch the latest changes from the main branch before starting work
- Rebase the branch with the main branch and fix conflicts
- Create a pull request using the pull-request-template.md. Fill in the descriptions to create the PR

---

**End of prompt_instruction.md**
