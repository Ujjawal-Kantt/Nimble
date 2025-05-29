import { ThemeProvider } from '@/components/theme-provider';
import { AgentInterface } from '@/components/agent-interface';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nimble-theme-preference">
      <AgentInterface />
    </ThemeProvider>
  );
}

export default App;