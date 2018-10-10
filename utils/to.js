export default function to(promise) {
    return promise.then(data => {
       return [data];
    })
    .catch(err => [null, err]);
 }
 