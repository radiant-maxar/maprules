FROM node:10.7.0-slim
RUN mkdir /home/maprules
COPY ./ /home/maprules
WORKDIR /home/maprules
# download dependencies
RUN echo "DOWNLOAD DEPENDENCIES" \
    && apt-get update \
    && apt-get install -yq sqlite3 libsqlite3-dev git
RUN npm install && yarn build && NODE_ENV=development yarn fixture
