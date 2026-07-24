export function WrongBoardDialog({ onCheckErrors, onKeepLooking }: { onCheckErrors: () => void; onKeepLooking: () => void }) {
  return <div className="overlay"><div className="dialog">
    <h2>Something’s not right yet</h2>
    <p>The board is full, but the solution is not correct.</p>
    <button onClick={onCheckErrors}>Check for errors</button>
    <button onClick={onKeepLooking}>Keep looking</button>
  </div></div>;
}
