import axios from 'axios';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '';

let apiBaseUrl = '/api/v1'

export async function getDictionaryItemByTerm (term, source) {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await axios.get(`${apiBaseUrl}/dictionary${term? `?searchTerm=${term}` : ''}`, {cancelToken: source.token});
            if (result && result.data) {
                return resolve(result.data);
            }
        } catch(ex) {
            console.dir(ex);
            return reject(ex);
        }
    });
}