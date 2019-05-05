const createList = array => {
    const listFilms = document.createElement('div');
    listFilms.classList.add('list-films');
  
    array.map( item => {
      const itemFilm = document.createElement('div');
      const img = document.createElement('img');
      const title = document.createElement('p');
  
      img.alt = ''
      if(item.Poster !== 'N/A'){
        img.src = item.Poster;
      } else {
        img.src = 'img/notFound.png';
        img.alt = 'Нет постера';
      }
      title.innerHTML = item.Title;
      itemFilm.classList.add('list-item');
      itemFilm.appendChild(img);
      itemFilm.appendChild(title);;
      listFilms.appendChild(itemFilm)
    });
  
    document.body.appendChild(listFilms);
  }
  
  const removeUnnecessaryElements = selector => {
    const element = document.querySelector(selector);
    if(element) document.body.removeChild(element);
}

const getFilms = url => {
    return new Promise( (resolve, reject) => {
  
      const xhr = new XMLHttpRequest();;
  
      xhr.open('GET', url);
  
      xhr.onload = () => {
        if(xhr.status === 200){
          resolve(xhr.response);
        } else {
          reject( new Error(`Ошибка: ${xhr.statusText}, ${xhr.status}`));
        }
      }
  
      xhr.onerror = () => {
        reject(new Error('Network Error'));
      }
  
      xhr.send();
    })
  }
  
  const embeded = url => {
    getFilms(url)
      .then( result => {
        let posts = JSON.parse(result);
        return posts;
      })
      .then( result => {
  
        if(result.Response === "False") throw new Error('Ничего не найдено');
  
        removeUnnecessaryElements('.list-films');
        removeUnnecessaryElements('body > p');
  
        createList(result.Search);
      })
      .catch( error => {
  
        removeUnnecessaryElements('.list-films');
        removeUnnecessaryElements('body > p');
  
        const p = document.createElement('p');
        p.innerHTML = error;
        document.body.appendChild(p);
      })
} 


const form = document.querySelector('form');

const handleSubmit = e => {
  e.preventDefault();
  const search = document.querySelector('[type="search"]');
  let value = search.value.trim();

  value.toLowerCase();

  if(value){
    let valueArray = value.split(' ');

    if(valueArray.length > 1){
      let valueStr = valueArray.join('+');
      embeded(`http://www.omdbapi.com/?s=${valueStr}&apikey=d5677312`);
    } else {
      embeded(`http://www.omdbapi.com/?s=${value}&apikey=d5677312`);
    }

  } else {
    console.log('Не введено значение');
  }
}

form.addEventListener('submit', handleSubmit);