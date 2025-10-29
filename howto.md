# How to Build and Run AutoThinker

This guide provides a step-by-step process for setting up and running the AutoThinker application using Docker Compose.

## Core Requirements

**IMPORTANT:** This application requires an NVIDIA GPU to run the local inference models. It will not work in an environment without a GPU and the proper drivers.

## Prerequisites

Before you begin, ensure your environment meets the following criteria:

*   **Hardware:** A machine with at least one NVIDIA GPU.
*   **Drivers:** The latest NVIDIA drivers for your GPU must be installed and running correctly. You can verify this by running `nvidia-smi`.
*   **Software:**
    *   Docker Engine
    *   Docker Compose
    *   NVIDIA Container Toolkit

## Environment Setup

1.  **Install the NVIDIA Container Toolkit:**

    The NVIDIA Container Toolkit is essential for allowing Docker containers to access the host's GPU. You must install it on your system.

    Follow the official installation guide for your specific Linux distribution:
    [https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

    After installation, the Docker daemon must be restarted.

2.  **API Key Configuration (Recommended):**

    The `docker-compose.yml` file currently contains a hardcoded NVIDIA API key. For better security, it is recommended to move this to an environment variable.

    You can create a `.env` file in the `autothinker-app` directory and add your key:

    '''
    NGC_API_KEY=your_nvapi_key_here
    '''

    You would then need to modify the `docker-compose.yml` to use this variable.

## Running the Application

Once your environment is correctly set up, you can start the entire application stack with a single command from the `autothinker-app` directory:

```bash
docker-compose up --build
```

This command will:
1.  Pull the required Docker images, including the `llama-3.1-nemotron-nano-8b-v1` image from the NVIDIA container registry.
2.  Build the `autothinker-backend` service.
3.  Start the `nim` (NVIDIA Inference Microservice) and `autothinker-backend` services.

The backend service will then be available, and you can interact with it as designed.

## AWS Deployment

For production deployment, you can use the following AWS services:

*   **Amazon EKS:** To deploy and scale the frontend and backend microservices.
*   **Amazon SageMaker:** To host the NVIDIA NIM inference endpoints.
*   **Amazon DynamoDB:** To store application data.

Refer to the official AWS documentation for instructions on how to deploy Docker containers and set up the necessary infrastructure.