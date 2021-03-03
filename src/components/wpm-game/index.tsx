import React, { useState, useEffect } from "react"
import data, { dataType } from "./data"
import BtnLink from "../../widgets/btn-link"
import SpotifyIcon from "../../images/spotify.png"
import YoutubeIcon from "../../images/youtube.png"

const compareStringsWithSplice = (text, textToCompareTo) => {
  if (!text || !textToCompareTo) return false
  // need to make the full text the same length as the input to see if the user
  // has typed in the right things so far
  const newChar = text[text.length - 1]
  const expectedChar = textToCompareTo[text.length - 1]
  //   console.log(newChar, "=?=", expectedChar)
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
  const [wpms, setWpms] = useState([]) // track wpm by phrase to average

  // Select a random data set to load if on initial load or game reset
  const initGameData = () => {
    // clear state
    setKeyboardInput("")
    setGameActive(true)
    setQueuePosition(0)
    setTimeStampGameStarted(undefined)
    setWpms([])

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
    setWpms(state => [...state, getWPM()])
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

    if (newInputValue === `${keyboardInput}\n`) {
      initGameData()
      return
    }
    if (!gameActive) {
      return
    }

    // dock the user points and dont save new input (only allow players to type in correct characters)
    if (
      !compareStringsWithSplice(
        newInputValue,
        currentSong.phrases[currentQueuePosition]
      )
    )
      return

    if (!timeStampGameStarted) setTimeStampGameStarted(Date.now)
    setKeyboardInput(newInputValue)
  }

  const [nextCharacter, remainingTextToType] = (() => {
    const currentPhrase = currentSong.phrases[currentQueuePosition]
    const allRemainingCharacters = currentPhrase.slice(
      keyboardInput.length,
      currentPhrase.length
    )

    const nextCharacter = allRemainingCharacters?.slice(0, 1)
    const remainingCharacters = allRemainingCharacters?.slice(
      1,
      allRemainingCharacters.length
    )
    return [nextCharacter, remainingCharacters]
  })()

  const getWPM = () => {
    const msSinceGameStarted = Date.now() - timeStampGameStarted
    const secondsSinceGameStarted =
      timeStampGameStarted === 0 ? 0 : msSinceGameStarted / 1000
    const numberOfWordsTyped = keyboardInput.length / 5 // its regulation to divide the num of chars by 5
    const wpm =
      keyboardInput && secondsSinceGameStarted > 0
        ? (numberOfWordsTyped / secondsSinceGameStarted) * 60
        : 0
    return wpm.toFixed(0)
  }

  const getAverageWPM = () => {
    if (!wpms.length) return getWPM()
    const average =
      [...wpms, getWPM()]
        .reduce((acc, wpm) => Number.parseInt(acc) + Number.parseInt(wpm), 0)
        .toFixed(0) / wpms.length
    return average.toFixed(0)
  }
  const averageWPM = getAverageWPM()
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
        {timeStampGameStarted && (
          <div style={{ paddingBottom: "16px", marginRight: "auto" }}>
            <span style={{ fontSize: "2rem" }}>{getAverageWPM()}</span>
            <span style={{ opacity: ".70" }}>LPM</span>
          </div>
        )}

        {!timeStampGameStarted ? (
          <>
            <div
              style={{
                opacity: ".40",
                position: "absolute",
                marginTop: "-300px",
                maxWidth: "960px",
                zIndex: 99999,
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                paddingLeft: "1.0875rem",
              }}
            >
              <div style={{ paddingRight: "12px" }}>Start typing to begin.</div>
              <div>
                Enter for <BtnLink label="next song" onClick={initGameData} />
              </div>
            </div>
          </>
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
            Enter for <BtnLink label="next song" onClick={initGameData} />
          </div>
        ) : null}
        {/* {wordsPerMinute}wpm - {secondsSinceGameStarted}s */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
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
          </div>

          <span style={{ marginLeft: "auto", marginTop: "24px" }}>
            {currentSong?.title} | {currentSong?.artist}
          </span>
          <div
            style={{
              marginLeft: "auto",
              paddingTop: "7px",
              zIndex: 99999,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {currentSong?.spotifyUrl ? (
              <a href={currentSong?.spotifyUrl} target="_blank" rel="noopener">
                <img
                  src={SpotifyIcon}
                  style={{ height: "30px", margin: "4px" }}
                />
              </a>
            ) : null}
            {currentSong?.youtubeUrl ? (
              <a href={currentSong?.youtubeUrl} target="_blank" rel="noopener">
                <img
                  src={YoutubeIcon}
                  style={{ height: "30px", margin: "4px" }}
                />
              </a>
            ) : null}
          </div>
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
