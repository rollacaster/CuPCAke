- [CuPCAke](#sec-1)
  - [Features](#sec-1-1)
  - [Requirements](#sec-1-2)
  - [Installation](#sec-1-3)
  - [Start](#sec-1-4)
    - [Default Environment Variables](#sec-1-4-1)
  - [Documentation](#sec-1-5)

# CuPCAke<a id="orgheadline7"></a>

CuPCAke (Cyber Physical Context Analytics) is a framework which allows to create
context information of Cyber Physical Systems (CPS). 

## Features<a id="orgheadline1"></a>

-   Custom context definitions
    -   Supported protocols: OPC UA, MQTT, CoAP
-   Context visualization
    -   Numeric visualizations
    -   Position visualizations

![Dashboard](http://cdn.makeagif.com/media/10-14-2015/qF7ofE.gif)

## Requirements<a id="orgheadline2"></a>

-   Node.js 0.12.x
-   MongoDB 2.6.x

## Installation<a id="orgheadline3"></a>

-   Run `npm install` to download dependencies.
-   Run `npm run build` to build CuPCAke.

## Start<a id="orgheadline5"></a>

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Command</th>
<th scope="col" class="org-left">Description</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">npm start</td>
<td class="org-left">Starts CuPCAKE in production environment.</td>
</tr>


<tr>
<td class="org-left">npm run develop</td>
<td class="org-left">Starts CuPCAKE in development environment. Each changes in a file triggers a restart of CuPCAke</td>
</tr>


<tr>
<td class="org-left">npm run test</td>
<td class="org-left">Starts CuPCAke in test environment. Runs the test suite of CuPCAKE and generates a test coverage report.</td>
</tr>
</tbody>
</table>

### Default Environment Variables<a id="orgheadline4"></a>

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="org-left" />

<col  class="org-right" />

<col  class="org-right" />

<col  class="org-left" />

<col  class="org-left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Environment</th>
<th scope="col" class="org-right">ContextGenerator Port</th>
<th scope="col" class="org-right">CPSAnalytics Port</th>
<th scope="col" class="org-left">MQTT Broker URL</th>
<th scope="col" class="org-left">MongoDB URL</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">production</td>
<td class="org-right">9000</td>
<td class="org-right">4000</td>
<td class="org-left">ws://localhost:3000</td>
<td class="org-left">mongodb://localhost/contextGenerator</td>
</tr>


<tr>
<td class="org-left">development</td>
<td class="org-right">8080</td>
<td class="org-right">4000</td>
<td class="org-left">ws://localhost:7000</td>
<td class="org-left">mongodb://localhost/contextGeneratorDev</td>
</tr>


<tr>
<td class="org-left">test</td>
<td class="org-right">7001</td>
<td class="org-right">4000</td>
<td class="org-left">ws://localhost:7000</td>
<td class="org-left">mongodb://localhost/contextGeneratorTest</td>
</tr>
</tbody>
</table>

## Documentation<a id="orgheadline6"></a>

The documentation is currently only accessible by starting CuPCAke.
