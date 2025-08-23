import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("💥 ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: "#fff",
          background: "#111827",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24
        }}>
          <div style={{maxWidth: 800}}>
            <h1 style={{fontSize: 24, marginBottom: 12}}>Se rompió el render 😬</h1>
            <pre style={{whiteSpace: "pre-wrap"}}>{String(this.state.error)}</pre>
            <p style={{opacity: .7, marginTop: 8}}>Revisa la consola del navegador para el stack completo.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
