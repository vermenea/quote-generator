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

    const copyToClipboard = (text: string) =>
        navigator.clipboard.writeText(text)

    return (
        <div className="container">
            <h1>Quote generator</h1>
            {isError && <div>Failed to fetch quotes</div>}
            {isLoading ? (
                <div>Loading</div>
            ) : (
                <div className="quotes">
                    {quotes.map((quote) => {
                        return (
                            <div
                                className="quote"
                                key={quote._id}
                                onClick={() => {
                                    copyToClipboard(quote.content)
                                }}
                            >
                                {quote.content}
                            </div>
                        )
                    })}
                </div>
            )}

            <button
                className="generate-btn"
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
                        parseInt(e.target.value !== '' ? e.target.value : '0')
                    )
                }
            ></input>
        </div>
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
