import axios, { AxiosResponse } from 'axios';
import fetch from 'node-fetch';
import { OPENAI_API_KEY } from './config.json';

const max_tokens: number = 64;
const ChatGPT: Function = async (prompt: string) => {
    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY as string}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: max_tokens,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.replace('\n\n', '');
}

const postReview: Function = async (productId: string, productName: string) => {
    let data: FormData, headers: object; // Set up HTTP request data

    // Define the data to send
    data = new FormData();
    data.append('url', 'comfortcloudshop.com');
    data.append('shop_domain', 'comfortcloudshop.com');
    data.append('platform', 'shopify');

    // Get a buyer name
    const name = await ChatGPT('Write exactly two words, give me a fairly uncommon, or common full name.');
    data.append('name', name.replace('.', ''));

    // Make a fake email address out of the name
    data.append('email', await ChatGPT(`Make a gmail email address out of ${name}`));

    // Set the rating 
    const rating = Math.random() < 0.3 ? '4' : '5';
    data.append('rating', rating);

    // Get the review title
    const title = await ChatGPT(`Write a title for a review of the product, 2 to 3 words
        something like "very good" or "i love it" or "fantastic" for the product: ${productName}.`);
    data.append('title', title.replace('"', '').replace('"', ''));

    // Get the review body
    const body = await ChatGPT(`Write a review of the product:  ${productName} 
        with the title: ${title}. Make it short. ${rating} star style.
        The word limit is 8-12. Make it sound natural. Make some grammatical errors, like forgetting to 
        capitalize some letters or to add comas.`);
    data.append('body', body.replace('"', '').replace('"', ''));

    // Specify the product ID (shopify).
    data.append('id', productId);

    // Define the request headers
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'multipart/form-data',
        'Origin': 'https://comfortcloudshop.com',
        'Referer': 'https://comfortcloudshop.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Connection': 'keep-alive',
    };

    // Send the POST request
    axios.post('https://judge.me/api/v1/reviews', data, {
            headers: headers
        })
        .then((response: AxiosResponse) => {
            console.log(response.status);
            console.log(response.data);
            console.log(data);
        })
        .catch((error) => {
            console.error(`Error: ${error}`);
        });
}

for (let i = 0; i < 10; i++) {
    postReview(
        '8375369564467', 
        'Inflatable Air Cushion Travel Pillow'
    );
}