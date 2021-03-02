import React, { useState, useEffect } from "react"
import data, { dataType } from "./data"

const compareStringsWithSplice = (text, textToCompareTo) => {
  console.log(text, textToCompareTo)
  if (!text || !textToCompareTo) return false
  // need to make the full text the same length as the input to see if the user
  // has typed in the right things so far
  const newChar = text[text.length - 1]
  const expectedChar = textToCompareTo[text.length - 1]
  console.log(newChar, "=?=", expectedChar)
  return newChar === expectedChar
}

const WpmGame = () => {
  const [keyboardInput, setKeyboardInput] = useState("")
  const [currentQueuePosition, setQueuePosition] = useState(0)
  const [currentSong, setCurrentSong] = useState(undefined as dataType) // gotta tell it what types this shit is
  const [lengthOfInput] = useState(200)
  const [timeStampGameStarted, setTimeStampGameStarted] = useState(
    undefined as number // milliseconds when current game was started
  )
  const [gameActive, setGameActive] = useState(false)

  // Select a random data set to load if on initial load or game reset
  const initGameData = () => {
    // clear state
    setKeyboardInput("")
    setGameActive(true)
    setQueuePosition(0)
    setTimeStampGameStarted(undefined)

    const randomDataIndex = Math.floor(Math.random() * (data.length - 1 + 1))
    const randomDataSelected = data[randomDataIndex]

    const lyricsNormalizedAndSplitIntoWords = randomDataSelected.text
      .normalize()
      .replace(/\n/g, ". ") // remove new lines
      .replace(/[(\.\*)]/g, "") // remove paren lyrics (ah-ah) (yeah)
      .replace(/[ ][ ]+/gm, " ") // remove duplicate spaces
      .replace(/ \? /gm, "? ") // had some wierd thing with " ? " happening
      .split(" ") // split into words

    const phrases = lyricsNormalizedAndSplitIntoWords.reduce(
      (acc = [], word) => {
        const existingPhrase = acc[acc?.length - 1]
        let currentWordSet =
          existingPhrase + `${existingPhrase ? " " : ""}${word}`
        acc[acc.length - 1] = currentWordSet
        if (currentWordSet.length > lengthOfInput) return [...acc, ""]
        return acc
      },
      [""]
    )

    setCurrentSong({
      ...randomDataSelected,
      text: phrases[0],
      phrases,
    })
  }

  const loadNextPhrase = () => {
    const queuePosition = currentQueuePosition + 1
    if (!currentSong.phrases[queuePosition]) {
      setGameActive(false) // no more phrases on this song, end game
      return
    }
    setTimeStampGameStarted(Date.now())
    setQueuePosition(queuePosition)
    setKeyboardInput("")
  }

  useEffect(() => {
    if (!currentSong) initGameData()
  }, []) // fire when page first mounts

  useEffect(() => {
    if (
      keyboardInput.length === currentSong?.phrases[currentQueuePosition].length
    )
      loadNextPhrase() // end the game, the player is done
  }, [keyboardInput])

  if (!currentSong) return null // loading

  // Game mechanics
  const onKeyboardInput = e => {
    const newInputValue = e.target.value
    console.log(
      newInputValue,
      compareStringsWithSplice(newInputValue, currentSong[currentQueuePosition])
    )
    if (newInputValue === `${keyboardInput}\n`) {
      initGameData()
      return
    }
    if (!gameActive) {
      return
    }

    if (!timeStampGameStarted) setTimeStampGameStarted(Date.now)

    console.log("hit")
    // dock the user points and dont save new input (only allow players to type in correct characters)
    if (
      !compareStringsWithSplice(
        newInputValue,
        currentSong.phrases[currentQueuePosition]
      )
    )
      return
    setKeyboardInput(newInputValue)
  }

  const [nextCharacter, remainingTextToType] = (() => {
    const currentPhrase = currentSong.phrases[currentQueuePosition]
    const allRemainingCharacters = currentPhrase.slice(
      keyboardInput.length,
      currentSong.text.length
    )

    const nextCharacter = allRemainingCharacters?.slice(0, 1)
    const remainingCharacters = allRemainingCharacters?.slice(
      1,
      allRemainingCharacters.length
    )
    return [nextCharacter, remainingCharacters]
  })()

  const msSinceGameStarted = Date.now() - timeStampGameStarted
  const secondsSinceGameStarted =
    timeStampGameStarted === 0 ? 0 : msSinceGameStarted / 1000
  const numberOfWordsTyped = keyboardInput.length / 5 // its regulation to divide the num of chars by 5
  const wordsPerMinute =
    keyboardInput && secondsSinceGameStarted > 0
      ? (numberOfWordsTyped / secondsSinceGameStarted) * 60
      : 0

  /*
       200 words / 60 sec = 2.3333wps

       5 words / 2.3sec = 2.17 words / 1 sec = 130wpm

    */

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          wordSpacing: "3px",
        }}
      >
        {!timeStampGameStarted ? (
          <div
            style={{
              opacity: ".40",
              position: "absolute",
              marginTop: "-300px",
              zIndex: 99999,
            }}
          >
            Start typing to begin | Enter for{" "}
            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={initGameData}
            >
              next song
            </button>
          </div>
        ) : null}
        {!gameActive && keyboardInput.length ? (
          <div
            style={{
              opacity: ".40",
              position: "absolute",
              marginTop: "-300px",
              zIndex: 99999,
            }}
          >
            Enter for{" "}
            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={initGameData}
            >
              next song
            </button>
          </div>
        ) : null}
        {/* {wordsPerMinute}wpm - {secondsSinceGameStarted}s */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>
            <span style={{ color: "#f2cc8f" }}>{keyboardInput}</span>
            <span style={{ color: "#e07a5f" }}>
              {nextCharacter === " " ? (
                <div
                  style={{
                    height: "18px",
                    width: "14px",
                    backgroundColor: "#e07a5f",
                    display: "inline-block",
                    opacity: ".80",
                  }}
                />
              ) : (
                nextCharacter
              )}
            </span>
            {remainingTextToType}...
          </p>
          <span
            style={{
              marginLeft: "auto",
              color: "81b29a",
            }}
          >
            {timeStampGameStarted ? wordsPerMinute.toFixed(0) : 0}
            WPM
          </span>
          <span style={{ marginLeft: "auto" }}>
            {currentSong?.title} | {currentSong?.artist}
          </span>
        </div>
        <div
          style={{
            display: "hidden",
            flexDirection: "column",
            width: "100%",
            position: "absolute",
            marginTop: "px",
          }}
        >
          <textarea
            onChange={onKeyboardInput}
            value={keyboardInput}
            autoFocus
            style={{
              width: "100%",
              height: "400px",
              opacity: "100%",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "transparent",
              textDecoration: "none",
              resize: "none",
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </>
  )
}

export default WpmGame
