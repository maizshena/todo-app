const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=API_9182918281_JQNGSTQWRTY"

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Kota:", data.name);
    console.log("Cuaca:", data.weather[0].description);
    console.log("Temperatur:", data.main.temp);
  })
  .catch((error) => {
    console.error("Terjadi kesalahan:", error);
  });
