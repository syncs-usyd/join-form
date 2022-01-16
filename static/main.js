function showSuccess(name) {
  $("#success-name").text(name);
  $("#success-alert").show();
}

$("#join-form").on("submit", ev => {
  ev.preventDefault();

  var fd = new FormData(ev.target);
  var international = fd.get("international") || null;
  if (international !== null) international = !!+international;

  var givenName = fd.get("firstName");
  var data = {
    firstName: givenName,
    lastName: fd.get("lastName"),
    gender: fd.get("gender") || undefined,
    email: fd.get("email"),
    sid: +fd.get("sid") || undefined,
    newsletter: fd.get("newsletter") == "on",
    doingIT: fd.get("doingIT") == "on",
    registered: true,
    expectedGradYear: +fd.get("expectedGradYear") || undefined,
    international: international
  };

  $("#submit").attr("disabled", true);

  console.log(data);

  fetch("https://api.suits.org.au/members", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`Got error status code ${response.status} from API`)
      }

      showSuccess(givenName);
      ev.target.reset();
      scroll(0, 0);
      $("#givenName").focus();
    })
    .catch(error => {
      console.error(error);
      $("#error-alert").show();
    })
    .finally(() => {
      $("#submit").attr("disabled", false);
    });
});
$("#submit").attr({ type: "submit", disabled: false });

$("#email").on("change", ev => {
  if (/^[a-z]{4}\d{4}$/.test(ev.target.value))
    ev.target.value += "@uni.sydney.edu.au";
});
$("#expected-grad-year").attr("min", new Date().getFullYear());

$("#success-close").on("click", _ => $("#success-alert").hide());
$("#error-close").on("click", _ => $("#error-alert").hide());
