// switching on select box (DETERMINISTIC||STOCHASTIC) on change
// 1)- select element
// 2)- watching if it`s value changed
// 3)- take action(if 0 ==> no value if 1 ==> deterministic if 2 ==> stochastic )
// actions(show input section depending on input value or hie it)

const SELECT_BOX_MAP = {
  NO_VALUE: "0",
  DETERMINISTIC: "1",
  STOCHASTIC: "2",
};

// select element
$("#choose-queue-select-box").on("change", function () {
  // switch on value
  switch ($(this).val()) {
    // if input is DETERMINISTIC
    case SELECT_BOX_MAP.DETERMINISTIC:
      // 1) show inputs deterministic section
      $("#deterministic-inputs").show();
      // 2) hide input parameter section
      $("#parameter-input-sec").show();
      // 3) show stochastic inputs
      $("#stochastic-inputs").hide();
      // 4) show  button (show results)
      $("#show-result-btn").show();
      // 5) hide  button (show results)
      $("#result-sec").hide();
      break;

    // if input is STOCHASTIC
    case SELECT_BOX_MAP.STOCHASTIC:
      // 1) hide inputs deterministic section
      $("#deterministic-inputs").hide();
      // 2) show input parameter section
      $("#parameter-input-sec").show();
      // 3) show stochastic inputs
      $("#stochastic-inputs").show();
      // 4) show  button (show results)
      $("#show-result-btn").show();
      // 5) hide  button (show results)
      $("#result-sec").hide();
      break;

    default:
      // 1) hide inputs deterministic section
      $("#deterministic-inputs").hide();
      // 2) hide input parameter section
      $("#parameter-input-sec").hide();
      // 3) hide stochastic inputs
      $("#result-sec").hide();
      // 4) hide  button (show results)
      $("#show-result-btn").hide();
      break;
  }
});

// validation and alerting

// 1) - check if lambda valid on blur
$("#arrival-time-input , #service-time-input ,#det-queue-capacity-input").on(
  "blur",
  function () {
    let hasError = false;
    // remove success class on this input
    $(this).removeClass("is-valid");

    // clear errors on this input
    $(this).next(".alert-section").children("small.err-msg").remove();

    // check if input empty
    if ($(this).val().trim() == "") {
      hasError = true;
      addErrorOnInput($(this), "This input is required.");
    }
    //  Number.isInteger(+$(this).val()) &&
    // check if input empty
    // if( $(this).val().trim()!='')
    // {
    //     hasError=true;
    //     addErrorOnInput($(this),'Please enter a valid Integer number.')
    // }

    if (!hasError) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      // clear errors on this input
      $(this).next(".alert-section").children("small.err-msg").remove();
    }
  }
);

// check validity for number of servers and capacity
$("#stochastic-servers-input , #stochastic-queue-capacity-input").on(
  "blur",
  function () {
    let hasError = false;
    // remove success class on this input
    $(this).removeClass("is-valid");

    // clear errors on this input
    $(this).next(".alert-section").children("small.err-msg").remove();

    // check if input empty
    if (!Number.isInteger(+$(this).val()) && $(this).val().trim() != "") {
      hasError = true;
      addErrorOnInput($(this), "Please enter a valid Integer number.");
    }

    if (!hasError) {
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      // clear errors on this input
      $(this).next(".alert-section").children("small.err-msg").remove();
    }
  }
);

// check validity for number of servers and capacity
$("#times-input , #nth-customer-input").on("blur", function () {
  let hasError = false;
  // remove success class on this input
  $(this).removeClass("is-valid");

  // clear errors on this input
  $(this).next(".alert-section").children("small.err-msg").remove();

  // check if the input is comma separated or has default value
  if (
    !(/(\d+,\d+)+$/.test($(this).val()) || /^\d+$/.test($(this).val())) &&
    $(this).val().trim() != ""
  ) {
    hasError = true;
    addErrorOnInput(
      $(this),
      "Please enter a valid Integer comma separated Input i.e 1,2,3  ."
    );
  }

  if (!hasError) {
    $(this).removeClass("is-invalid");
    $(this).addClass("is-valid");
    // clear errors on this input
    $(this).next(".alert-section").children("small.err-msg").remove();
  }
});

//start working on submit button logic
$("#show-result-btn").on("click", function (e) {
  e.preventDefault();
  // depending on select box i will get action
  const SELECT_BOX_VAL = $("#choose-queue-select-box").val(),
    ARRIVAL_TIME = $("#arrival-time-input").val(),
    SERVICE_TIME = $("#service-time-input").val();

  switch (SELECT_BOX_VAL) {
    case SELECT_BOX_MAP.DETERMINISTIC:
      const DET_CAPACITY = $("#det-queue-capacity-input").val(),
        TIMES = $("#times-input").val().trim(),
        NTH_CUSTOMER = $("#nth-customer-input").val().trim(),
        lambda = 1 / ARRIVAL_TIME,
        mu = 1 / SERVICE_TIME;

      // check if required inputs inserted
      if (
        isReqInputsFilled(
          "#arrival-time-input",
          "#service-time-input",
          "#det-queue-capacity-input"
        )
      ) {
        let ti = 0,
          times_elm,
          nth_c_el;
        //hide stochastic result section
        $("#stochastic-result-sec").hide();
        //show Deterministic result section
        $("#result-sec").show();
        $("#deterministic-result-sec").show();
        $("#times-left").children().remove();
        $("#nth-customer-right").children().remove();

        //   calculate ti
        for (let i = ARRIVAL_TIME; i <= 200; i++) {
          if (
            Math.floor(i * lambda) -
              Math.floor(precise(mu * i) - precise(mu / lambda)) ==
            +DET_CAPACITY + 1
          ) {
            ti = i;
            break;
          }
        }

        //case user wants general case for n(t)
        // case if user want general form
        if (TIMES == "") {
          times_elm = ` <div class="p-2 bg-light rounded result border border-danger number-of-customers-at-t">
                                <div class="nth-of-customer-general-form fs-20 lh-3">
                                For t < 1/&lambda; or t < ${ARRIVAL_TIME} <span class="fs-22 font-weight-bolder"> n(t) = 0</span><br>
                                For ${ARRIVAL_TIME}< t < ti or ${ARRIVAL_TIME} ≤ t < ${ti}<span class="fs-22 font-weight-bolder"> n(t) =[ t * ${precise(
            lambda
          )} ] - [${precise(mu)} x t - ${precise(mu / lambda)}]  </span><br>
                                For t ≥ ti or or t ≥ ${ti} <span class="fs-20 font-weight-bolder">n(t) alternates between (${DET_CAPACITY} and ${
            DET_CAPACITY - 1
          }).</span>
                            </div>
                            </div>`;
        } else {
          times_elm = `   <div class="bg-light rounded result border border-danger number-of-customers-at-t">
                                <div class="row">`;

          // start split times (2,3,4)
          TIMES.split(",").forEach((element) => {
            times_elm += `  <div class="col-lg-6">
                        <!-- number of customers in system totally -->
                        <div class="p-3 text-center">
                            <span class="customors-in-system px-2 pt-2 fs-3rem d-block">
                                ${
                                  +element >= ti
                                    ? `${DET_CAPACITY} or ${DET_CAPACITY - 1}`
                                    : Math.floor(+element * lambda) -
                                      Math.floor(
                                        precise(mu * element) -
                                          precise(mu / lambda)
                                      )
                                }<span class="text-muted fs-15">customer</span>
                            </span>
                            <span class=" customors-in-system-text">
                                <span class="fs-2rem">n(${element})</span> 
                                <span class="text-muted"> Number of customers in system at <b> ${element}</b>.</span>
                            </span>
                        </div>
                    <!-- number of customers in system totally -->
                    </div> `;
          });
          times_elm += `</div> </div>`;
        }
        if (NTH_CUSTOMER == "") {
          nth_c_el = `<div class="p-2 bg-light rounded result border border-danger number-of-customers-at-t">
                                <div class="nth-of-customer-general-form fs-20 lh-3">
                                For n = 0  <span class="fs-22 font-weight-bolder">Wq(n) = 0</span><br>
                                For n < &lambda;ti or n < ${ti}<span class="fs-22 font-weight-bolder"> Wq(n) = ${
            1 / mu - 1 / lambda
          }(n-1)</span><br>
                                For n ≥ &lambda;ti or n ≥ ${ti}, <span class="fs-20 font-weight-bolder">Wq(t) alternates between (${
            (1 / mu - 1 / lambda) * (ti * lambda - 2)
          } or ${(1 / mu - 1 / lambda) * (ti * lambda - 3)}).</span>
                            </div>
                            </div>`;
        } else {
          nth_c_el = `   <div class="bg-light rounded result border border-danger number-of-customers-at-t">
                                    <div class="row">`;

          // start split times (2,3,4)
          NTH_CUSTOMER.split(",").forEach((element) => {
            nth_c_el += ` <div class="col-lg-6">
                            <!-- number of customers in system totally -->
                            <div class="p-3 text-center">
                            <span class="customors-in-system px-2 pt-2 fs-3rem d-block">
                                ${
                                  (1 / mu - 1 / lambda) * (+element - 1)
                                }<span class="text-muted fs-15">time</span>
                            </span>
                            <span class=" customors-in-system-text">
                                <span class="fs-2rem">Wq(${element})</span> 
                                <span class="text-muted"> Waiting time of  <b> ${element}</b> customer in queue.</span>
                            </span>
                            </div>
                        <!-- number of customers in system totally -->
                        </div> `;
          });
          nth_c_el += `</div> </div>`;
        }

        $("#times-left").append(times_elm);
        $("#nth-customer-right").append(nth_c_el);
        // draw the graph
        drawArrivals(ARRIVAL_TIME);
        // draw service times
        drawService(ARRIVAL_TIME, SERVICE_TIME);
        // draw departure times
        drawDeparture(+ARRIVAL_TIME + +SERVICE_TIME, SERVICE_TIME);
      }

      break; //end deterministic section

    case SELECT_BOX_MAP.STOCHASTIC:
      const CAPACITY = $("#stochastic-queue-capacity-input").val().trim(),
        SERVERS = Math.max($("#stochastic-servers-input").val(), 1);

      if (
        isReqInputsFilled("#arrival-time-input", "#service-time-input") &&
        isInputsGtZero(
          "#stochastic-servers-input",
          "#arrival-time-input",
          "#service-time-input"
        )
      ) {
        //show stochastic result section
        $("#deterministic-result-sec").hide();
        $("#result-sec").show();
        $("#stochastic-result-sec").show();
        const lambda = 1 / ARRIVAL_TIME,
          mu = 1 / SERVICE_TIME;
        let results;
        if (SERVERS == 1 && CAPACITY == "") {
          // case 1 m/m/1
          results = calc_m_m_1(lambda, mu);
        } else if (SERVERS == 1 && CAPACITY > 0) {
          // case 2 m/m/1/k
          results = calc_m_m_1_k(lambda, mu, CAPACITY);
        } else if (SERVERS > 1 && CAPACITY == "") {
          // case 3 m/m/c
          results = calc_m_m_c(lambda, mu, SERVERS);
          console.log("mmc");
        } else if (SERVERS > 1 && CAPACITY > 0) {
          // case 4 m/m/c/k
          results = calc_m_m_c_k(lambda, mu, SERVERS, CAPACITY);
        }
        $("#stochastic-result-sec #expected-num-customers").text(
          precise(results.l)
        );
        $("#stochastic-result-sec #expected-num-customers-q").text(
          precise(results.lq)
        );
        $("#stochastic-result-sec #expected-waiting").text(precise(results.w));
        $("#stochastic-result-sec #expected-waiting-q").text(
          precise(results.wq)
        );
      }
      break;
  }
  // $('#arrival-time-input , #service-time-input
});

// function calculate m/m/1 model
const calc_m_m_1 = (lambda, mu) => {
  const result = { l: 0, lq: 0, w: 0, wq: 0 };
  result.l = lambda / (mu - lambda);
  result.lq = (lambda * lambda) / (mu * mu - lambda * mu);
  result.w = 1 / (mu - lambda);
  result.wq = lambda / (mu * (mu - lambda));
  return result;
};

// function calculate m/m/1/k model
const calc_m_m_1_k = (lambda, mu, k) => {
  k = +k;
  const result = { l: 0, lq: 0, w: 0, wq: 0 },
    ro = lambda / mu,
    e1 = k + 1,
    e2 = ro ** k,
    e3 = ro ** (k + 1);
  let pk, lambda_dash;
  // case 1 if ro !=1
  if (ro != 1) {
    result.l = ro * ((1 - e1 * e2 + k * e3) / ((1 - ro) * (1 - e3)));
    pk = e2 * ((1 - ro) / (1 - e3));
  } else {
    result.l = k / 2;
    pk = 1 / (k + 1);
  }
  lambda_dash = lambda * (1 - pk);
  console.log(lambda_dash, result.l, lambda, pk, 1 - pk);
  result.w = result.l / lambda_dash;
  result.wq = result.w - 1 / mu;
  result.lq = lambda_dash * result.wq;
  return result;
};
// function calculate m/m/c model
const calc_m_m_c = (lambda, mu, c) => {
  c = +c;
  const result = { l: 0, lq: 0, w: 0, wq: 0 },
    r = lambda / mu,
    ro = r / c;
  let p0,
    sum = 0;
  // check ro>1
  if (ro < 1) {
    // calc sum
    for (let i = 0; i <= c - 1; i++) {
      sum += r ** i / fact(i);
    }
    sum += (c * r ** c) / (fact(c) * (c - r));
  } else {
    // calc sum
    for (let i = 0; i <= c - 1; i++) {
      sum += r ** i / fact(i);
    }
    console.log(sum);
    sum += (r ** c * (c * mu)) / (fact(c) * (c * mu - lambda));
    console.log(sum);
  }
  p0 = 1 / sum;
  console.log(p0, sum);
  result.lq =
    p0 *
    ((r ** c * lambda * mu) /
      (fact(c - 1) * ((c * mu - lambda) * (c * mu - lambda))));
  result.wq = result.lq / lambda;
  result.w = result.wq + 1 / mu;
  result.l = result.lq + lambda / mu;
  return result;
};

// function calculate m/m/c/k model
const calc_m_m_c_k = (lambda, mu, c, k) => {
  c = +c;
  k = +k;
  const result = { l: 0, lq: 0, w: 0, wq: 0 },
    r = lambda / mu,
    ro = r / c;
  let p0,
    sum = 0;
  // check ro>1
  if (ro < 1) {
    // calc sum
    for (let i = 0; i <= c - 1; i++) {
      sum += r ** i / fact(i);
    }
    sum += ((1 - (1 - ro ** (k - c + 1))) * r ** c) / (fact(c) * (1 - ro));
  } else {
    // calc sum
    for (let i = 0; i <= c - 1; i++) {
      sum += r ** i / fact(i);
    }
    sum += (r ** c * (k - c + 1)) / fact(c);
  }
  p0 = 1 / sum;
  result.lq =
    p0 *
    (((1 - (ro ** (k - c + 1) - (1 - ro) * (k - c + 1) * ro ** (k - c))) *
      (r ** c * lambda * p0)) /
      (fact(c - 1) * ((1 - lambda) * (1 - lambda))));
  // calculating l
  sum = 0;
  let pk = 0,
    lambda_dash;
  for (let n = 0; n <= c - 1; n++) {
    sum += ((c - n) * r ** n) / fact(n);
  }
  result.l = result.lq + c - p0 * sum;
  result.wq = result.lq / lambda;
  if (k < c) {
    pk = (r ** k * p0) / fact(k);
  } else {
    pk = (r ** k * p0) / (c ** (k - c) * fact(c));
  }
  lambda_dash = lambda * (1 - pk);
  result.w = result.l / lambda_dash;
  result.wq = result.lq + lambda_dash;
  return result;
};

const datasets = [
  {
    barThickness: 6,
    data: Array(20).fill(1),
    label: "# of Customers",
    backgroundColor: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ],
    borderWidth: 1,
  },
];
// func draw departure graph
const drawDeparture = (time, time2) => {
  time = +time;
  time2 = +time2;
  const config = {
    type: "bar",
    data: {
      labels: createXDep(time, time2),
      datasets,
    },
  };
  new Chart(document.getElementById("departure-graph-canvas"), config);
};

// func draw service graph
const drawService = (time, time2) => {
  const config = {
    type: "bar",
    data: {
      labels: createXDep(time, time2),
      datasets,
    },
  };
  new Chart(document.getElementById("service-graph-canvas"), config);
};

// func draw arrivals graph
const drawArrivals = (time) => {
  const config = {
    type: "bar",
    data: {
      labels: createXAx(time),
      datasets,
    },
  };
  new Chart(document.getElementById("arrival-graph-canvas"), config);
};

//  create x axis data
const createXDep = (time, time2) => {
  time = +time;
  time2 = +time2;
  let sum = time;
  const data = [sum];
  for (let i = sum; i < 19; i++) {
    sum += time2;
    data.push(sum);
  }
  return data;
};

//  create x axis data
const createXAx = (time) => {
  const data = [];
  for (let i = 1; i < 20; i++) {
    data.push(i * time);
  }
  return data;
};

// precise number for 4
function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
}

// helper function to check if required inputs filled
const isReqInputsFilled = (...ids) => {
  return ids.every((e) => $(e).val().trim() != "" && $(e).val().trim() > 0);
};
// helper function to check if  inputs>0
const isInputsGtZero = (...ids) => {
  return ids.every((e) => $(e).val().trim() > 0);
};

// helper function to add error msg
const addErrorOnInput = (input, msg) => {
  const errStyle = `<small  class="err-msg text-danger form-text"> 
<i class="fa fa-exclamation-circle mr-1"></i> ${msg}.
</small>   `;
  // add danger border on input
  input.addClass("is-invalid");
  // append error in last
  input.next(".alert-section").append(errStyle);
};

// calc factorial
const fact = (i) => {
  let sum = 1;
  for (let j = 1; j <= i; j++) sum *= j;
  return sum;
};
