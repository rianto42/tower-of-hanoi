# Tower of Hanoi Solution Tree Visualization

An interactive React application that visualizes the complete solution space of the Tower of Hanoi puzzle as a tree structure. Each node in the tree represents a possible state of the puzzle, with edges showing valid moves between states.

## Features

- **Interactive Tree Visualization**: Each node displays the actual tower configuration with colored disks on pegs A, B, and C
- **Multiple Layout Types**: 
  - Hierarchical: Nodes arranged in levels by depth
  - Radial: Nodes arranged in concentric circles
  - Force-directed: Natural spring-based layout
- **Real-time Interaction**: Hover to see node details, click to select nodes
- **Solution Animation**: Watch the optimal path from start to goal state
- **Responsive Design**: Adapts to different screen sizes
- **Performance Optimized**: Efficient algorithms for trees up to 6 disks

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd TowerOfHanoi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Usage

1. **Adjust Settings**: Use the controls to change the number of disks (1-6), layout type, or animation speed
2. **Generate Tree**: Click "Generate Tree" to create the visualization
3. **Interact**: 
   - Hover over nodes to see detailed information
   - Click nodes to select them
   - Use the info panel to view node properties
4. **Animate Solution**: Click "Animate Solution" to watch the optimal solving path
5. **View Statistics**: Check the stats panel for tree metrics

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Application header
│   ├── Controls.js        # Control panel with settings
│   ├── TreeCanvas.js      # HTML5 Canvas component for visualization
│   ├── Stats.js           # Statistics display
│   └── InfoPanel.js       # Node information panel
├── hooks/
│   └── useHanoiTree.js    # Custom hook for Tower of Hanoi logic
├── App.js                 # Main application component
└── index.js              # Application entry point
```

## Technical Details

### Algorithm
- Uses breadth-first search to build the complete solution tree
- Each node represents a state (e.g., "AAB" means disk 0 on peg A, disk 1 on peg A, disk 2 on peg B)
- Edges represent valid moves between states
- Solution path is found using BFS from root to goal state

### Visualization
- HTML5 Canvas for high-performance rendering
- Custom drawing functions for towers and disks
- Multiple layout algorithms for different tree arrangements
- Smooth animations and interactions

### Performance
- Optimized for trees up to 6 disks (exponential growth)
- Efficient memory usage with Map data structures
- RequestAnimationFrame for smooth rendering
- Debounced calculations for better responsiveness

## Customization

### Adding New Layout Types
1. Add a new case in `useHanoiTree.js` `calculatePositions` function
2. Implement the layout algorithm
3. Add the option to the Controls component

### Modifying Visual Styles
- Edit styled-components in each component file
- Adjust colors, sizes, and animations
- Modify the disk colors array in `TreeCanvas.js`

### Extending Functionality
- Add new puzzle variants by modifying the `getValidMoves` function
- Implement different solution algorithms
- Add export/import functionality for tree data

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Acknowledgments

- Based on the classic Tower of Hanoi puzzle
- Inspired by graph visualization techniques
- Built with React and modern web technologies
