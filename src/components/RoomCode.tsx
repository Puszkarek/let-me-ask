import copyIcon from "../assets/images/copy.svg";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps): JSX.Element {
  function copyCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }
  return (
    <button onClick={copyCodeToClipboard} className="copy-area-container">
      <div className="copy-area-content">
        <span className="copy-area-icon">
          <img src={copyIcon} alt="Copy room code" />
        </span>
        <span className="copy-area-url">{props.code}</span>
      </div>
    </button>
  );
}
