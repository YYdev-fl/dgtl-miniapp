import Link from "next/link"

function index() {
  return (
    <div className="flex flex-col min-h-screen">
    {/* Main content */}
    <div className="flex-grow p-4">
      <h1 className="text-2xl font-bold">Tasks page</h1>
      <p>Your main content goes here.</p>
      <button className="btn glass">Glass button</button>
    </div>

    <div role="tablist" className="tabs tabs-boxed">
    <a role="tab" className="tab h-16" href="/">Home</a>
    <a role="tab" className="tab h-16" href="/boosts">Boosts</a>
    <a role="tab" className="tab tab-active h-16" href="/tasks">Tasks</a>
    <a role="tab" className="tab h-16" href="/friends">Friends</a>
  </div>
  </div>
  )
}

export default index