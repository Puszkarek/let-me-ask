import { Link, useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";

import "../styles/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
export function NewRoom() {
	const { user } = useAuth();
	const history = useHistory();
	const [newRoom, setNewRoom] = useState("");
	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();
		if (newRoom.trim() === "") return;
		const roomRef = database.ref("rooms");

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});
		const roomKey = firebaseRoom.key;
		history.push(`/admin/rooms/${roomKey}`);
	}
	return (
		<div id='page-auth' className='page-auth'>
			<aside className='aside-container'>
				<img
					className='illustration'
					src={illustrationImg}
					alt='Ilustração simbolizando perguntas e respostas'
				/>

				<strong className='aside-title'>
					Crie salas de perguntas em tempo real
				</strong>
				<p className='aside-description'>
					Tire as dúvidas de sua audiência
				</p>
			</aside>
			<main className='home-main-container'>
				<div className='home-main-content'>
					<img src={logoImg} alt='LetMeAsk' className='logo' />

					<form onSubmit={handleCreateRoom}>
						<input
							className='input-home'
							type='text'
							placeholder='Nome da sala'
							onChange={(event) => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type='submit'>Entrar na Sala</Button>
					</form>
					<p className='description-form'>
						Quer entrar em uma sala existente?{" "}
						<Link to='/'>Clique Aqui</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
