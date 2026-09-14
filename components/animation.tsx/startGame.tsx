import Image from "next/image";
import { useEffect } from "react";

export default function StartGameAnimation() {
	useEffect(() => {
		const slashSound = new Audio("/slashCard.mp3");
		const slashTimer = window.setTimeout(() => {
			void slashSound.play().catch(() => undefined);
		}, 4_020);

		return () => {
			window.clearTimeout(slashTimer);
			slashSound.pause();
		};
	}, []);

	return (
		<div className="start-game-animation" aria-hidden="true">
			<div className="start-game-animation__glow" />
			<div className="start-game-animation__card">
				<Image src="/Joker.webp" alt="" fill priority sizes="min(68vw, 500px)" className="start-game-animation__art" />
			</div>
			<div className="start-game-animation__tear start-game-animation__tear--left">
				<Image src="/Joker.webp" alt="" fill priority sizes="min(68vw, 500px)" className="start-game-animation__art" />
			</div>
			<div className="start-game-animation__tear start-game-animation__tear--right">
				<Image src="/Joker.webp" alt="" fill priority sizes="min(68vw, 500px)" className="start-game-animation__art" />
			</div>
			<div className="start-game-animation__cracks">
				<span className="start-game-animation__crack start-game-animation__crack--one" />
				<span className="start-game-animation__crack start-game-animation__crack--two" />
				<span className="start-game-animation__crack start-game-animation__crack--three" />
			</div>
		</div>
	);
}
