App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    $.getJSON("../real-estate.json", function (data) {
      var list = $("#list");
      var template = $("#template");

      for (i = 0; i < data.length; i++) {
        template.find("img").attr("src", data[i].picture);
        template.find(".id").text(data[i].id);
        template.find(".type").text(data[i].type);
        template.find(".area").text(data[i].area);
        template.find(".price").text(data[i].price);

        list.append(template.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      console.log("MetaMask is installed!");
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider(
        "http://localhost:8545"
      );

      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("RealEstate.json", function (data) {
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      return App.loadRealEstates();
    });
  },

  buyRealEstate: function () {
    var id = $("#id").val();
    var name = $("#name").val();
    var price = $("#price").val();
    var age = $("#age").val();

    // console.log(id);
    // console.log(price);
    // console.log(name);
    // console.log(age);

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.RealEstate.deployed()
        .then(function (instance) {
          var nameUtf8Encoded = utf8.encode(name);
          return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, {
            from: account,
            value: price,
          });
        })
        .then(function () {
          $("#name").val("");
          $("#age").val("");
          $("#buyModal").modal("hide");
          // return App.loadRealEstates();
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  loadRealEstates: function () {
    // App.contracts.RealEstate.deployed()
    //   .then(function (instance) {
    //     return instance.getAllbuyers.call();
    //   })
    //   .then(function (buyers) {
    //     for (i = 0; i < buyers.length; i++) {
    //       if (buyers[i] !== "0x0000000000000000000000000000000000000000") {
    //         var imgType = $(".panel-realEstate")
    //           .eq(i)
    //           .find("img")
    //           .attr("src")
    //           .substr(7);
    //         switch (imgType) {
    //           case "apartment.jpg":
    //             $(".panel-realEstate")
    //               .eq(i)
    //               .find("img")
    //               .attr("src", "images/apartment_sold.jpg");
    //             break;
    //           case "townhouse.jpg":
    //             $(".panel-realEstate")
    //               .eq(i)
    //               .find("img")
    //               .attr("src", "images/townhouse_sold.jpg");
    //             break;
    //           case "house.jpg":
    //             $(".panel-realEstate")
    //               .eq(i)
    //               .find("img")
    //               .attr("src", "images/house_sold.jpg");
    //             break;
    //         }
    //         $(".panel-realEstate")
    //           .eq(i)
    //           .find(".btn-buy")
    //           .text("??????")
    //           .attr("disabled", true);
    //       }
    //     }
    //   })
    //   .catch(function (err) {
    //     console.log(err.message);
    //   });
  },

  listenToEvents: function () {},
};

$(function () {
  $(window).load(function () {
    App.init();
  });

  $("#buyModal").on("show.bs.modal", function (e) {
    var id = $(e.realatedTarget).parent().find(".id").text();
    var price = web3.toWei(
      parseFloat($(e.realatedTarget).parent().find(".price").text() || 0),
      "ether"
    );

    $(e.currentTarget).find("#id").val(id);
    $(e.currentTarget).find("#price").val(price);
  });
});

const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

ethereumButton.addEventListener("click", () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  showAccount.innerHTML = account;
}
