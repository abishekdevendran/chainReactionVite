import Board from "./components/Board"

function App() {
  return (
    <div className='justify-center w-screen text-center select-none'>
    Vite and TailwindCSS setup successfully.
    <Board n={8} m={6} color={"red"} delay={1}/>
    </div>
  )
}

export default App
