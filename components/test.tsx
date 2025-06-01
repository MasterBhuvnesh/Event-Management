'use dom';

export default function DOMComponent({ name }: { name: string }) {
  return (
    <div style={{ textAlign: 'center', margin: '20px', color: 'blue' }}>
      <h1 style={{ color: 'red' }}>Hello, {name}</h1>
    </div>
  );
}
