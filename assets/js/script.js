document.getElementById("convertButton").addEventListener("click", function () {
  // Obtener el valor ingresado en pesos chilenos
  let pesos = parseFloat(document.getElementById("pesosInput").value);

  if (isNaN(pesos) || pesos <= 0) {
    alert("Por favor, ingresa un valor válido en pesos chilenos.");
    return;
  }

  // Obtener la moneda a convertir
  let currency = document.getElementById("currencySelect").value;

  // Consultar la API mindicador.cl para obtener las tasas de cambio
  fetch("https://mindicador.cl/api")
    .then((response) => {
      console.log("Respuesta de la API principal recibida:", response);
      return response.json();
    })
    .then((data) => {
      let exchangeRate;

      // Obtener la tasa de cambio correspondiente
      switch (currency) {
        case "dolar":
          exchangeRate = data.dolar.valor;
          break;
        case "euro":
          exchangeRate = data.euro.valor;
          break;
        // Agrega más casos según las monedas disponibles
        default:
          alert("Moneda no soportada.");
          return;
      }

      // Realizar la conversión
      let convertedValue = pesos / exchangeRate;

      // Mostrar el resultado
      document.getElementById(
        "result"
      ).innerText = `Valor convertido: ${convertedValue.toFixed(
        2
      )} ${currency.toUpperCase()}`;

      // Obtener el historial de los últimos 10 días para la moneda seleccionada
      fetch(`https://mindicador.cl/api/${currency}/10`)
        .then((response) => {
          console.log("Respuesta de la API de historial recibida:", response);
          return response.json();
        })
        .then((historyData) => {
          console.log("Datos del historial recibidos:", historyData);
          let labels = historyData.serie
            .map((item) => item.fecha.split("T")[0])
            .reverse();
          let values = historyData.serie.map((item) => item.valor).reverse();

          // Crear el gráfico
          let ctx = document
            .getElementById("exchangeRateChart")
            .getContext("2d");
          new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: `Historial de ${currency.toUpperCase()} (últimos 10 días)`,
                  data: values,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: "Fecha",
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: "Valor",
                  },
                },
              },
            },
          });
        })
        .catch((error) => {
          console.error("Error al obtener el historial:", error);
          alert(
            "Hubo un problema al obtener el historial. Por favor, intenta de nuevo más tarde."
          );
        });
    })
    .catch((error) => {
      console.error("Error al consultar la API:", error);
      alert(
        "Hubo un problema al consultar las tasas de cambio. Por favor, intenta de nuevo más tarde."
      );
    });
});
