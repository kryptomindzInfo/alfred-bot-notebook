import { Router } from 'express';
import Docker from 'dockerode';
import axios from 'axios';

const router = Router();
const docker = new Docker();
const image = "asaifee02/chatgpt-finrl-bot";

router.post('/create', async (req, res) => {
  const api_key = req.body.api_key;
  const api_secret = req.body.api_secret;
  const api_domain = req.body.api_domain.toLowerCase();

  if(api_key && api_secret && api_domain){
    await docker.createContainer({
      Image: image,
      Env: [
        `API_KEY=${api_key}`,
        `API_SECRET=${api_secret}`,
        `API_DOMAIN=${api_domain}`
      ],
    }).then(async container => {
      await container.start()
      .then(_ => res.status(200).json({"id": container.id}));
    }).catch(e => res.status(500).json({"error": e}));
  }
  else {
    res.status(400).json({"error": 'Please provide "name", "api_key", "api_secret" and "api_domain" in api request.'});
  }
});

router.post('/resume', async (req, res) => {
  const id = req.body.id;
  if(id){
    await docker.getContainer(id).start()
    .then(_ => res.status(200).json({"status": "container started"}))
    .catch(e => res.status(500).json({"error": e}))
  }
  else res.status(400).json({"error": 'Please provide container id in "id" field in api request.'});
});

router.post('/stop', async (req, res) => {
  const id = req.body.id;
  if(id){
    await docker.getContainer(id).stop()
    .then(_ => res.status(200).json({"status": "container stopped"}))
    .catch(e => res.status(500).json({"error": e}))
  }
  else res.status(400).json({"error": 'Please provide container id in "id" field in api request.'});
});

router.post('/remove', async (req, res) => {
  const id = req.body.id;
  if(id){
    await docker.getContainer(id).remove({force: true})
    .then(_ => res.status(200).json({"status": "container removed"}))
    .catch(e => res.status(500).json({"error": e}))
  }
  else res.status(400).json({"error": 'Please provide container id in "id" field in api request.'});
});

router.post('/error', async(req, res) => {
  const id = req.body.id;
  const ctr = docker.getContainer(id);
  await ctr.inspect()
  .then(async data => {
    const bot_id = await data.Id;
    await ctr.logs({stderr: true, tail: 5})
    .then(data => {
      let error = '';
      const logs = data.toString().split('\n').reverse();

      for(const log of logs){
        if(log.includes("error") || log.includes("Error")){
          error += log.replace(/[\u0000\u0001\u0002\ufffd]/g, '');
          break;
        }
      }

      const apiUrl = 'https://api.tradingalfred.com/botError';
      const dataToSend = {
        id: bot_id,
        reason: error
      };
      
      axios.put(apiUrl, dataToSend)
        .then(response => res.status(200).json({"id": bot_id, "error": error, "response": response.data}))
        .catch(error => res.status(500).json({"error": error}));
    })
    .catch(e => res.status(500).json({"error": e}));
  })
  .catch(e => res.status(500).json({"error": e}));
})

export default router;
