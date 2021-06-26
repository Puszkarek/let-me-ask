import copyIcon from "../assets/images/copy.svg";

import "../styles/components/room-code.scss";

type RoomCodeProps = {
	code: string;
};

export function RoomCode(props: RoomCodeProps) {
	function copyCodeToClipboard() {
		navigator.clipboard.writeText(props.code);
	}
	return (
		<button onClick={copyCodeToClipboard} className='btn-room-code'>
			<div className='btn-room-code-icon-container'>
				<img src={copyIcon} alt='Copy room code' />
			</div>
			<span className='btn-room-code-text'> Sala #{props.code}</span>
		</button>
	);
}
