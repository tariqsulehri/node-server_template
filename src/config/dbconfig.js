const { Client } = require("cassandra-driver");

exports.client = new Client({
  cloud: {
    secureConnectBundle: __dirname + "/secure-connect-secondbody-dev.zip",
  },
  credentials: {
    username: "YefYLyjIuGxTaxxMSkraHhnZ",
    password:
      "q4i5_tGxu1X0KhtxAslPSuOpI3XxhTmFl.JGvIzy.-Zah0JZTmZRFgc81M_pjwZm+8uT0exWovHBF2NfXHCPTaK5+erUILbhAHiBFBqDDGKkxmhgS5C.PbZWLPhZuDNy",
  },

  keyspace: "dev_ks",
});

