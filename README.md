<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. CuPCAke</a>
<ul>
<li><a href="#sec-1-1">1.1. Features</a></li>
<li><a href="#sec-1-2">1.2. Requirements</a></li>
<li><a href="#sec-1-3">1.3. Installation</a></li>
<li><a href="#sec-1-4">1.4. Start</a>
<ul>
<li><a href="#sec-1-4-1">1.4.1. Default Environment Variables</a></li>
</ul>
</li>
<li><a href="#sec-1-5">1.5. Documentation</a></li>
</ul>
</li>
</ul>
</div>
</div>

# CuPCAke<a id="sec-1" name="sec-1"></a>

CuPCAke (Cyber Physical Context Analytics) is a framework which allows to create
context information of Cyber Physical Systems (CPS). 

## Features<a id="sec-1-1" name="sec-1-1"></a>

-   Custom context definitions
    -   Supported protocols: OPC UA, MQTT, CoAP
-   Context visualization
    -   Numeric visualizations
    -   Position visualizations

![Dashboard](http://cdn.makeagif.com/media/10-14-2015/qF7ofE.gif)

## Requirements<a id="sec-1-2" name="sec-1-2"></a>

-   Node.js 0.12.x
-   MongoDB 2.6.x

## Installation<a id="sec-1-3" name="sec-1-3"></a>

-   Run `npm install` to download dependencies.
-   Run `npm build` to build CuPCAke.

## Start<a id="sec-1-4" name="sec-1-4"></a>

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="left" />

<col  class="left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="left">Command</th>
<th scope="col" class="left">Description</th>
</tr>
</thead>

<tbody>
<tr>
<td class="left">npm start</td>
<td class="left">Starts CuPCAke in production environment.</td>
</tr>


<tr>
<td class="left">npm run develop</td>
<td class="left">Starts CuPCAKE in development environment. Each changes in a file triggers a restart of CuPCAke</td>
</tr>


<tr>
<td class="left">npm run test</td>
<td class="left">Starts CuPCAke in test environment. Runs the test suite of CuPCAKE and generates a test coverage report.</td>
</tr>
</tbody>
</table>

### Default Environment Variables<a id="sec-1-4-1" name="sec-1-4-1"></a>

<table border="2" cellspacing="0" cellpadding="6" rules="groups" frame="hsides">


<colgroup>
<col  class="left" />

<col  class="right" />

<col  class="right" />

<col  class="left" />

<col  class="left" />
</colgroup>
<thead>
<tr>
<th scope="col" class="left">Environment</th>
<th scope="col" class="right">ContextGenerator Port</th>
<th scope="col" class="right">CPSAnalytics Port</th>
<th scope="col" class="left">MQTT Broker URL</th>
<th scope="col" class="left">MongoDB URL</th>
</tr>
</thead>

<tbody>
<tr>
<td class="left">production</td>
<td class="right">9000</td>
<td class="right">4000</td>
<td class="left">ws://localhost:3000</td>
<td class="left">mongodb://localhost/contextGenerator</td>
</tr>


<tr>
<td class="left">development</td>
<td class="right">8080</td>
<td class="right">4000</td>
<td class="left">ws://localhost:7000</td>
<td class="left">mongodb://localhost/contextGeneratorDev</td>
</tr>


<tr>
<td class="left">test</td>
<td class="right">7001</td>
<td class="right">4000</td>
<td class="left">ws://localhost:7000</td>
<td class="left">mongodb://localhost/contextGeneratorTest</td>
</tr>
</tbody>
</table>

## Documentation<a id="sec-1-5" name="sec-1-5"></a>

The documentation is currently only accessible by starting CuPCAke.