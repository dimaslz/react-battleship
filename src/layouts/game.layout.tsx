import { useCallback, useEffect, useMemo, useState } from 'react';

import { ComputerBoard, GameHistory, HumanBoard, ScoreBoard } from '@/components';
import { BOARD_SIZE, BOATS, PLAYER, SHOT_VALUE } from '@/constants';
import { useBoard, useGame } from '@/hooks';
import { createArray, generateItems } from '@/methods';
import { BOARD_BOX_ITEM, BOAT, BoatForPlayer, CursorPosition, TSHOT_VALUE } from '@/types';
import { randomNumber, wait } from '@/utils';

import { ComputerWinsLayout, HumanWinsLayout, ShotFeedbackLayout } from '.';

let boatsForPlayer: BoatForPlayer[] = structuredClone(
	BOATS.map((boat) => ({
		...boat,
		pending: false,
		done: false,
	})),
);

function GameLayout() {
	const {
		scores,
		computerWins,
		humanWins,
		items,
		updateItems,
		board,
		turn,
		setTurn,
		maxScores,
	} = useBoard(
		structuredClone(generateItems()),
	);
	const [boxesOver, setBoxesOver] = useState<number[]>([]);
	const [showComputerBoats, setShowComputerBoats] = useState<boolean>(false);
	const [gameReady, setGameReady] = useState<boolean>(false);
	const [gameCounter, setGameCounter] = useState<number>(5);
	const [counterState, setCounterState] = useState<string>('');
	const [hideBoats, setHideBoats] = useState<boolean>(false);

	const [boatToSet, setBoatToSet] = useState<{ boat: BoatForPlayer; key: number; } | null>(null);
	const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);
	const [shotResult, setShotResult] = useState<{ type: TSHOT_VALUE; content: string; } | null>(null);
	const { history, setBoatPosition, switchOrientation, randomOrientation } = useGame({
		setBoxesOver,
		items,
	});

	const playersAreReady = useMemo(() => {
		const boatsLeng = BOATS.map((boat) => boat.squares).reduce(
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

	const isConflict = useMemo<boolean>(() => {
		return !!(
			boatToSet &&
			items.some((item) => {
				return item.player[PLAYER.HUMAN].filled && boxesOver.includes(item.box);
			})
		);
	}, [boxesOver, items, boatToSet]);

	const onKeydownHandler = useCallback(
		async ($event: KeyboardEvent) => {
			if ($event.code === 'Space') {
				switchOrientation();

				if (cursorPosition) {
					const boxes = setBoatPosition(cursorPosition);
					updateItems((prevItems) => {
						return prevItems.map((item) => {
							item.over = boxes.includes(item.box);

							return item;
						});
					});
				}
			}
		},
		[cursorPosition, setBoatPosition, switchOrientation, updateItems],
	);

	useEffect(() => {
		document.addEventListener('keydown', onKeydownHandler);

		return () => {
			document.removeEventListener('keydown', onKeydownHandler);
		};
	}, [onKeydownHandler]);

	// INIT
	let mounted = false;
	useEffect(() => {
		if (mounted) return;
		mounted = true;

		const boats: BOAT[] = [...BOATS];

		let _items = items;

		while (boats.length) {
			const boat = boats.pop();
			if (!boat) break;

			const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
			const row = Math.ceil(box / BOARD_SIZE);
			randomOrientation();

			const boxes = setBoatPosition({ box, row, boat: boat.squares });

			const conflict = _items.some((item) => {
				return item.player[PLAYER.COMPUTER].filled && boxes.includes(item.box);
			});

			if (conflict) {
				boats.push(boat);

				continue;
			}

			_items = _items.map((item) => {
				if (boxes.includes(item.box)) {
					item.player[PLAYER.COMPUTER].filled = true;
				}

				return item;
			});
		}

		updateItems(_items);
	}, []);

	const onMouseOverToSetBoatHandler = useCallback(
		({ box, row }: BOARD_BOX_ITEM) => {
			if (!boatToSet) return;

			setCursorPosition({ box, row, boat: boatToSet.boat.squares });
			const boxes = setBoatPosition({ box, row, boat: boatToSet.boat.squares });

			updateItems((prevItems) => {
				return prevItems.map((item) => {
					item.over = boxes.includes(item.box);

					return item;
				});
			});
		},
		[setCursorPosition, setBoatPosition, updateItems, boatToSet],
	);

	const playerBoatsDone = useMemo(() => {
		const squares = BOATS.map((b) => b.squares).reduce((a, b) => a + b, 0);
		return (
			items.filter((i) => i.player[PLAYER.HUMAN].filled).length === squares
		);
	}, [items]);

	const onClickToSetBoatHandler = useCallback(() => {
		if (isConflict) return;
		if (playerBoatsDone) return;
		if (!boatToSet) return;

		updateItems((prevItems) => {
			return prevItems.map((item) => {
				if (boxesOver.includes(item.box)) {
					item.player[PLAYER.HUMAN].filled = true;
				}

				return item;
			});
		});

		setCursorPosition(null);
		boatsForPlayer[boatToSet.key].pending = false;
		boatsForPlayer[boatToSet.key].done = true;
		setBoatToSet(null);
		setBoxesOver([]);
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, [boxesOver, boatToSet, playerBoatsDone]);

	const onClickBoatHandler = useCallback((boat: BoatForPlayer, key: number) => {
		if (boat.done) return;

		setBoatToSet({ boat, key });

		boatsForPlayer = boatsForPlayer.map((boatForPlayer, boatKey) => {
			boatForPlayer.pending = key === boatKey;
			return boatForPlayer;
		});
	}, []);

	const onClickShowComputerBoatsHandler = useCallback(() => {
		setShowComputerBoats((prev: boolean) => !prev);
	}, []);

	const onMouseLeaveBoardHandler = useCallback(() => {
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, []);

	const onClickStartGame = useCallback(() => {
		if (playersAreReady) {
			setGameReady(true);
		}
	}, [playersAreReady]);

	const onClickBoxToShotHandler = useCallback(
		async (_item: BOARD_BOX_ITEM) => {
			if (_item.player[PLAYER.HUMAN].shot) return;

			const successShot = _item.player[PLAYER.COMPUTER].filled;

			updateItems((prevItems: BOARD_BOX_ITEM[]) => {
				return prevItems.map((item: BOARD_BOX_ITEM) => {
					const isComputerBoat = item.player[PLAYER.COMPUTER].filled;
					if (item.box === _item.box) {
						item.player[PLAYER.HUMAN].shot = {
							value: isComputerBoat
								? SHOT_VALUE.TOUCH
								: SHOT_VALUE.WATER,
							date: Date.now(),
						};
					}

					return item;
				});
			});

			await wait(500);

			if (successShot) {
				setShotResult({
					type: SHOT_VALUE.TOUCH,
					content: 'Nice shot!!! 🙌',
				});
			} else {
				setShotResult({
					type: SHOT_VALUE.WATER,
					content: 'Oops! water!, sharpen your aim 🎯',
				});
			}

			await wait(1000);

			setShotResult(null);
			setTurn(PLAYER.COMPUTER);
		},
		[items],
	);

	const randomTurn = useCallback(() => {
		const player = [PLAYER.HUMAN, PLAYER.COMPUTER][randomNumber(0, 1)];

		setTurn(player);
	}, []);

	const computerTurnAction = useCallback(async () => {
		await wait(1000);

		const allowedBoxes = items.filter(
			(item) => !item.player[PLAYER.COMPUTER].shot,
		);
		const box = randomNumber(0, allowedBoxes.length);
		const alreadyDone = items.find(
			(item, itemIndex) =>
				itemIndex === box && item.player[PLAYER.COMPUTER].shot,
		);

		if (alreadyDone) {
			computerTurnAction();
			return;
		}

		const successShot = items.find((item) => {
			return item.box === box && item.player[PLAYER.HUMAN].filled;
		});

		await updateItems((prevItems: BOARD_BOX_ITEM[]) => {
			return prevItems.map((item: BOARD_BOX_ITEM) => {
				const isHumanBoat = item.player[PLAYER.HUMAN].filled;
				if (item.box === box) {
					item.player[PLAYER.COMPUTER].shot = {
						value: isHumanBoat
							? SHOT_VALUE.TOUCH
							: SHOT_VALUE.WATER,
						date: Date.now(),
					};
				}

				return item;
			});
		});

		await wait(500);

		setTurn(PLAYER.HUMAN);

		if (successShot) {
			setShotResult({
				type: SHOT_VALUE.TOUCH,
				content: '😵, the computer hits one of your boats',
			});
		} else {
			setShotResult({
				type: SHOT_VALUE.WATER,
				content: 'Water!! Everyone is save!',
			});
		}

		await wait(1000);

		setShotResult(null);
	}, [items]);

	useEffect(() => {
		if (turn === PLAYER.COMPUTER) {
			computerTurnAction();
		}
	}, [turn]);

	const runCounter = useCallback(async () => {
		setCounterState(String(gameCounter));
		await wait(1000);

		if (gameCounter === 1) {
			setGameCounter(0);
			setCounterState('goooo!');

			await wait(500);
			setCounterState('');

			randomTurn();

			return;
		}

		if (gameReady) {
			setGameCounter(gameCounter - 1);
		}
	}, [gameReady, gameCounter]);

	useEffect(() => {
		if (!gameReady || gameCounter === 0) return;

		runCounter();
	}, [gameReady, runCounter, gameCounter]);

	const resetGame = () => {
		window.location.reload();
	};

	const onClickBoxOnHumanBoard = (item: BOARD_BOX_ITEM) => {
		if (gameReady) {
			onClickBoxToShotHandler(item);
		} else {
			onClickToSetBoatHandler();
		}
	};

	if (computerWins) {
		return <ComputerWinsLayout onClickReset={resetGame} />;
	}

	if (humanWins) {
		return <HumanWinsLayout onClickReset={resetGame} />;
	}

	return (
		<>
			{shotResult && <ShotFeedbackLayout type={shotResult.type} content={shotResult.content} />}

			<div>
				<div className="flex">
					<div className="flex flex-col">
						<h2 className="text-4xl py-2">Your board</h2>
						<div>
							<div
								className="flex flex-col w-full justify-center items-center relative"
								onMouseLeave={onMouseLeaveBoardHandler}
							>
								{counterState && (
									<div className="absolute inset-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center">
										{counterState && (
											<div className="text-8xl">{counterState}</div>
										)}
									</div>
								)}
								{turn === PLAYER.COMPUTER && (
									<div className="absolute inset-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center">
										Computer is thinking
									</div>
								)}

								<HumanBoard
									board={board}
									disableClick={isConflict && !!boatToSet}
									onMouseOver={onMouseOverToSetBoatHandler}
									onClick={onClickBoxOnHumanBoard}
									hideBoats={hideBoats}
								/>
							</div>
							{gameReady && !counterState && (
								<div>
									<div className="w-full flex items-start">
										<button
											onClick={() => setHideBoats((prev) => !prev)}
											className="p-2 bg-blue-800 text-white hover:bg-blue-950"
										>
											{!hideBoats && <div>hide boats</div>}
											{hideBoats && <div>show boats</div>}
										</button>
									</div>
									<div className="w-full">
										{turn === PLAYER.HUMAN && (
											<span className="text-green-600">your turn</span>
										)}
										{turn === PLAYER.COMPUTER && (
											<span className="text-red-600">
												wait!, the computer is thinking
											</span>
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{!gameReady && (
						<div className="w-full px-4">
							<h2 className="text-4xl py-2">Boats</h2>
							<div className="text-sm py-4">
								<p>
									Here your boats! Click on one of them and (the color will turn
									to orange), and move the mouse to on the Board in the left.
									Press <code className="font-console text-slate-600">space</code> bar to
									change the orientation. Once you have desired where you want
									to sert your boat, click on the box in the board and back here
									to get other boat.
								</p>
							</div>
							<div className="w-auto space-y-4">
								{boatsForPlayer?.map((boat, boatKey: number) => (
									<div
										className={[
											'relative text-white uppercase',
											boat.done ? 'cursor-not-allowed' : 'hover:cursor-pointer group',
										].join(' ')}
										key={boatKey}
										onClick={() => onClickBoatHandler(boat, boatKey)}
									>
										<div className="w-full h-full absolute flex items-center justify-center pointer-events-none">
											{boat.label}
										</div>
										<div className="flex items-center justify-center pointer-events-none">
											{createArray(boat.squares).map((_, squareKey: number) => {
												return (
													<div
														className={[
															'w-[50px] h-[50px] border',
															boat.pending ? 'bg-orange-200' : '',
															boat.done ? 'bg-green-200' : '',
															!boat.pending && !boat.done ? 'bg-blue-600 group-hover:bg-blue-800' : '',
														].join(' ')}
														key={squareKey}
													></div>
												);
											})}
										</div>
									</div>
								))}
							</div>

							<div className="mt-12">
								<button
									className={[
										'text-2xl py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:cursor-pointer',
										!playerBoatsDone
											? 'cursor-not-allowed disabled:bg-gray-400'
											: '',
									].join(' ')}
									disabled={!playersAreReady}
									onClick={onClickStartGame}
								>
									start
								</button>
							</div>
						</div>
					)}
					{gameReady && (
						<div className="w-full px-4">
							<h2 className="text-4xl py-2">Scores</h2>

							<ScoreBoard scores={scores} maxScores={maxScores} />

							<GameHistory history={history} />
						</div>
					)}
				</div>

				<div className="flex w-full justify-start mt-12">
					<button
						onClick={onClickShowComputerBoatsHandler}
						className="p-2 bg-blue-800 text-white"
					>
						{!showComputerBoats && (
							<span>show computer boats (just to test)</span>
						)}
						{showComputerBoats && <span>hide computer boats</span>}
					</button>
				</div>
				{showComputerBoats && (
					<div>
						<h2>Computer bddoard</h2>
						<ComputerBoard board={board} />
						<div></div>
					</div>
				)}
			</div>
		</>
	);
}

export default GameLayout;
