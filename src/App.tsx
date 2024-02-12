import { useState } from 'react'
import './App.css'

const BASE_API_URL = 'https://api.quotable.io'

type Quote = {
    _id: string
    content: string
    author: string
    authorSlug: string
    length: number
    tags: string[]
}

function App() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [amount, setAmount] = useState<number>(1)
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [copiedQuote, setCopiedQuote] = useState<string>('')
    const [showPopup, setShowPopup] = useState<boolean>(false)

    const isValid = amount >= 1 && amount <= 50

    const handleGenerateQuote = async (amount: number) => {
        try {
            setIsError(false)
            setIsLoading(true)
            const quotes = await fetchQuote(amount)
            setQuotes(quotes)
        } catch (err) {
            setIsError(true)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedQuote(text)
        setTimeout(() => {
            setCopiedQuote('')
        }, 1000)
    }

    const handleInfoHover = () => {
        setShowPopup(true)
    }

    const handleInfoLeave = () => {
        setShowPopup(false)
    }

    return (
        <>
            <div className="container">
                <div
                    className="icon-container"
                    onMouseEnter={handleInfoHover}
                    onMouseLeave={handleInfoLeave}
                >
                    {' '}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="info-circle icon-tabler icon-tabler-info-circle"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M12 9h.01" />
                        <path d="M11 12h1v4h1" />
                    </svg>
                    {showPopup && (
                        <p className="popup">
                            Copy button only allows you to copy first quote
                        </p>
                    )}
                </div>

                <h1>Quote generator</h1>
                {isError && <div>Failed to fetch quotes</div>}
                {isLoading ? (
                    <div>Loading</div>
                ) : (
                    <div className="quotes">
                        {quotes.map((quote) => {
                            return (
                                <>
                                    {' '}
                                    <div className="quote" key={quote._id}>
                                        {'❝' + quote.content + '❞'}
                                    </div>
                                </>
                            )
                        })}
                        <button
                            className="btn"
                            onClick={() => copyToClipboard(quotes[0]?.content)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-copy"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                />
                                <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                            </svg>
                        </button>
                    </div>
                )}

                <div>
                    {copiedQuote && <p>Copied!</p>}
                    <button
                        className="btn"
                        onClick={() => handleGenerateQuote(amount)}
                        disabled={!isValid}
                    >
                        generate
                    </button>
                    <input
                        className="quote-amount"
                        type="number"
                        defaultValue={amount}
                        onChange={(e) =>
                            setAmount(
                                parseInt(
                                    e.target.value !== '' ? e.target.value : '0'
                                )
                            )
                        }
                    ></input>
                </div>
            </div>
            <footer>
                Coded by<a href="https://github.com/vermenea"> vermenea</a>
            </footer>
        </>
    )
}

const fetchQuote = async (amount: number) => {
    const resp = await fetch(BASE_API_URL + `/quotes/random?limit=${amount}`, {
        method: 'GET',
    })
    if (!resp.ok) throw new Error('HTTP Error')
    const data: Quote[] = await resp.json()
    return data
}

export default App
