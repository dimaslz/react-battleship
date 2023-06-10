import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BOATS, ORIENTATION, PLAYER } from '@/constants';
import { setHorizontalBoatPosition, setVerticalBoatPosition } from '@/methods';
import { BoardBoxItem, BoatsInGame, CursorPosition, History, Hits, Orientation, Player } from '@/types';
import { randomNumber } from '@/utils';

type Props = {
	setBoxesOver: (arr: number[]) => void;
	items: BoardBoxItem[];
};

const useGameHook = ({ setBoxesOver, items }: Props) => {
	const [hits, updateHits] = useState<Hits>({
		"human": [],
		"computer": [],
	});
	const orientation = useRef<Orientation>(ORIENTATION.HORIZONTAL);
	const [boatsInGame, updateBoatsInGame] = useState<BoatsInGame>({
		"human": [],
		"computer": [],
	});
	const [gameReady, setGameReady] = useState<boolean>(false);
	const [gameCounterValue, updateGameCounterValue] = useState<number>(5);
	const [gameCounterLabel, updateGameCounterLabel] = useState<string>('');

	const switchOrientation = useCallback(() => {
		orientation.current =
			orientation.current === ORIENTATION.HORIZONTAL
				? ORIENTATION.VERTICAL
				: ORIENTATION.HORIZONTAL;
	}, [orientation]);

	const playersAreReady = useMemo(() => {
		const boatsLeng = BOATS.map((boat) => boat.length).reduce<number>(
			(accumulator, current) => accumulator + current,
			0,
		);

		const computerIsReady =
			items.filter((item) => item.player[PLAYER.COMPUTER]?.filled).length ===
			boatsLeng;
		const humanIsReady =
			items.filter((item) => item.player[PLAYER.HUMAN]?.filled).length ===
			boatsLeng;

		return computerIsReady && humanIsReady;
	}, [items]);

	const setBoatPosition = useCallback(
		({ box, boat }: CursorPosition) => {
			const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
			const vertical = orientation.current === ORIENTATION.VERTICAL;

			let boxes: number[] = [];

			if (horizontal) {
				boxes = setHorizontalBoatPosition(box, boat);
			}

			if (vertical) {
				boxes = setVerticalBoatPosition(box, boat);
			}

			setBoxesOver(boxes);

			return boxes;
		},
		[orientation, setBoxesOver],
	);

	const randomOrientation = () => {
		orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][
			randomNumber(0, 1)
		];
	};

	const history = useMemo<History[]>(() => {
		const accumulator: History[] = [];
		const hits: Hits = {
			"human": [],
			"computer": [],
		};

		for (const item of items) {
			const computerShot = item.player[PLAYER.COMPUTER].shot;
			const humanShot = item.player[PLAYER.HUMAN].shot;

			if (computerShot) {
				hits[PLAYER.COMPUTER].push(item.box);
			}

			if (humanShot) {
				hits[PLAYER.HUMAN].push(item.box);
			}

			if (computerShot) {
				accumulator.push({
					...item,
					date: computerShot.date,
					value: computerShot.value,
					who: PLAYER.COMPUTER,
					sunk: !!item.player[PLAYER.COMPUTER].shot?.sunk,
				});
			}

			if (humanShot) {
				accumulator.push({
					...item,
					date: humanShot.date,
					value: humanShot.value,
					who: PLAYER.HUMAN,
					sunk: !!item.player[PLAYER.HUMAN].shot?.sunk,
				});
			}

		}

		updateHits(hits);
		return accumulator
			.sort((prevItem, nextItem) => prevItem.date > nextItem.date ? - 1 : 1);
	}, [items]);

	useEffect(() => {
		(Object.entries(hits) as [Player, number[]][]).forEach(([player, playerHits]) => {
			const opponent = player === PLAYER.COMPUTER ? PLAYER.HUMAN : PLAYER.COMPUTER;

			boatsInGame[opponent] = boatsInGame[opponent].map((boat) => {
				boat.sunk = boat.squares.every((square) => playerHits.includes(square));
				return boat;
			});
		});

		updateBoatsInGame(boatsInGame);
	}, [hits]);

	return {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		setGameReady,
		updateGameCounterValue,
		updateGameCounterLabel,
		updateBoatsInGame,
		gameReady,
		history,
		playersAreReady,
		counter: {
			value: gameCounterValue,
			label: gameCounterLabel,
		},
		boatsInGame,
	};
};

export default useGameHook;
