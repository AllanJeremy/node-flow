var fractal = require("fractal-transformer")();

class PeerTransformer {
  peer = (data) =>
    fractal(data, {
      id: "id",
      peer_id: "peer_id",
      first_name: "peer.first_name",
      unique_id: "peer.unique_id",
      profile_picture: function (data) {
        return (
          process.env.API_IMAGE_URL +
          "/avatar/" +
          data.get("peer.profile_picture")
        );
      },
      status: function (data) {
        return data.get("status");
      },
    });

  newMatch = (count, data) => {
    return {
      res: fractal(data, {
        id: "item.id",
        peer_id: "item.id",
        first_name: "item.name",
        unique_id: "item.unique_id",
        profile_picture: function (data) {
          return (
            process.env.API_IMAGE_URL +
            "/avatar/" +
            data.get("item.profile_picture")
          );
        },
        health_categories: function (data) {
          var healthCategories = data.get("item.health_categories");
          return healthCategories.map((item) => {
            return { health_category: { name: item } };
          });
        },
      }),
      count: count,
    };
  };

  search = (data) =>
    fractal(data, {
      id: "id",
      peer_id: "id",
      first_name: "first_name",
      unique_id: "unique_id",
      profile_picture: function (data) {
        return (
          process.env.API_IMAGE_URL + "/avatar/" + data.get("profile_picture")
        );
      },
    });
}

module.exports = PeerTransformer;
